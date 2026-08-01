<?php

declare(strict_types=1);

// STAGING ONLY: this adapter emulates the small Sardine contract used by the
// local backend. Replace it with the approved Sardine service before release.
$runtimeRoot = __DIR__ . DIRECTORY_SEPARATOR . 'runtime';
$fileRoot = $runtimeRoot . DIRECTORY_SEPARATOR . 'files';
$metadataRoot = $runtimeRoot . DIRECTORY_SEPARATOR . 'metadata';
$publicBaseUrl = 'http://127.0.0.1:9003';

foreach ([$fileRoot, $metadataRoot] as $directory) {
    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

$json = static function (array $payload, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
};

if ($requestPath === '/health' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $json([
        'status' => 'ok',
        'service' => 'sardine-staging',
        'environment' => 'local-qa',
    ]);
}

if (preg_match('#^/files/([a-f0-9]{32})$#', $requestPath, $matches) === 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        $json(['message' => 'Method not allowed'], 405);
    }

    $id = $matches[1];
    $metadataPath = $metadataRoot . DIRECTORY_SEPARATOR . $id . '.json';

    if (!is_file($metadataPath)) {
        $json(['message' => 'File not found'], 404);
    }

    $metadata = json_decode((string) file_get_contents($metadataPath), true);
    $filePath = is_array($metadata) ? ($metadata['file_path'] ?? '') : '';

    if (!is_string($filePath) || !is_file($filePath)) {
        $json(['message' => 'File not found'], 404);
    }

    header('Content-Type: ' . ($metadata['mime_type'] ?? 'application/octet-stream'));
    header('Content-Length: ' . (string) filesize($filePath));
    header('Content-Disposition: inline; filename="' . ($metadata['client_original_name'] ?? 'download') . '"');
    readfile($filePath);
    exit;
}

if ($requestPath !== '/files' || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    $json(['message' => 'Not found'], 404);
}

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    $json(['message' => 'The file field is required'], 422);
}

$upload = $_FILES['file'];
$uploadError = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);

if ($uploadError !== UPLOAD_ERR_OK) {
    $json(['message' => 'Upload failed', 'upload_error' => $uploadError], 422);
}

$size = (int) ($upload['size'] ?? 0);
if ($size > 15 * 1024 * 1024) {
    $json(['message' => 'Maximum staging upload size is 15 MB'], 422);
}

$temporaryPath = (string) ($upload['tmp_name'] ?? '');
if ($temporaryPath === '' || !is_uploaded_file($temporaryPath)) {
    $json(['message' => 'Invalid uploaded file'], 422);
}

$originalName = basename((string) ($upload['name'] ?? 'upload.bin'));
$originalName = preg_replace('/[^A-Za-z0-9._-]/', '_', $originalName) ?: 'upload.bin';
$id = bin2hex(random_bytes(16));
$extension = strtolower((string) pathinfo($originalName, PATHINFO_EXTENSION));
$storedName = $id . ($extension !== '' ? '.' . $extension : '.bin');
$filePath = $fileRoot . DIRECTORY_SEPARATOR . $storedName;

if (!move_uploaded_file($temporaryPath, $filePath)) {
    $json(['message' => 'Unable to persist staging upload'], 500);
}

$mimeType = (string) ($upload['type'] ?? 'application/octet-stream');
if (function_exists('mime_content_type')) {
    $detectedMimeType = mime_content_type($filePath);
    if (is_string($detectedMimeType) && $detectedMimeType !== '') {
        $mimeType = $detectedMimeType;
    }
}

$metadata = [
    'id' => $id,
    'client_original_name' => $originalName,
    'file_name' => $storedName,
    'file_path' => $filePath,
    'mime_type' => $mimeType,
    'size' => $size,
    'folder' => (string) ($_POST['folder'] ?? 'files/wiwitan'),
    'visibility' => (string) ($_POST['visibility'] ?? 'public'),
];

file_put_contents(
    $metadataRoot . DIRECTORY_SEPARATOR . $id . '.json',
    json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
);

$json([
    'status' => 'success',
    'data' => [
        'url' => $publicBaseUrl . '/files/' . $id,
        'file_name' => $storedName,
        'client_original_name' => $originalName,
        'path' => 'runtime/files/' . $storedName,
        'disk' => 'sardine-staging',
        'size' => $size,
        'mime_type' => $mimeType,
    ],
]);
