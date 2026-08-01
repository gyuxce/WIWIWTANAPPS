[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,

    [string]$FixturePath,

    [string]$RemoteFolder = 'qa/wiwitan',

    [switch]$RunUploadReadback,

    [ValidateRange(5, 300)]
    [int]$TimeoutSeconds = 30
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Net.Http

$base = $BaseUrl.TrimEnd('/')
$baseUri = $null
if (-not [Uri]::TryCreate($base, [UriKind]::Absolute, [ref]$baseUri)) {
    throw "BaseUrl must be an absolute URL: $BaseUrl"
}

if ($baseUri.Scheme -notin @('http', 'https')) {
    throw "BaseUrl must use http or https: $BaseUrl"
}

$httpClient = [System.Net.Http.HttpClient]::new()
$httpClient.Timeout = [TimeSpan]::FromSeconds($TimeoutSeconds)
$httpClient.DefaultRequestHeaders.Accept.Clear()
$httpClient.DefaultRequestHeaders.Accept.Add(
    [System.Net.Http.Headers.MediaTypeWithQualityHeaderValue]::new('application/json')
)

function Invoke-JsonGet {
    param([string]$Url)

    $response = $httpClient.GetAsync($Url).GetAwaiter().GetResult()
    $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    if (-not $response.IsSuccessStatusCode) {
        throw "GET $Url returned HTTP $([int]$response.StatusCode)"
    }

    return [PSCustomObject]@{
        StatusCode = [int]$response.StatusCode
        Body = $body
    }
}

function New-ProbeFixture {
    $path = Join-Path ([IO.Path]::GetTempPath()) ("wiwitan-sardine-probe-{0}.bin" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $bytes = [Text.Encoding]::UTF8.GetBytes("WIWITAN-SARDINE-PROBE $(Get-Date -Format o)`n")
    [IO.File]::WriteAllBytes($path, $bytes)
    return $path
}

$generatedFixture = $false
$fixture = $FixturePath

try {
    $health = Invoke-JsonGet -Url "$base/health"
    Write-Host "[PASS] GET /health -> HTTP $($health.StatusCode)"

    if (-not $RunUploadReadback) {
        Write-Host '[INFO] Health-only mode. Add -RunUploadReadback for multipart upload and byte readback.'
        return
    }

    if ([string]::IsNullOrWhiteSpace($fixture)) {
        $fixture = New-ProbeFixture
        $generatedFixture = $true
    }

    if (-not (Test-Path -LiteralPath $fixture -PathType Leaf)) {
        throw "Fixture file was not found: $fixture"
    }

    $fileName = [IO.Path]::GetFileName($fixture)
    $form = [System.Net.Http.MultipartFormDataContent]::new()
    $fileContent = [System.Net.Http.ByteArrayContent]::new([IO.File]::ReadAllBytes($fixture))
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('application/octet-stream')
    $form.Add($fileContent, 'file', $fileName)
    $form.Add([System.Net.Http.StringContent]::new($RemoteFolder), 'folder')
    $form.Add([System.Net.Http.StringContent]::new('public'), 'visibility')

    $uploadResponse = $httpClient.PostAsync("$base/files", $form).GetAwaiter().GetResult()
    $uploadBody = $uploadResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    if (-not $uploadResponse.IsSuccessStatusCode) {
        throw "POST $base/files returned HTTP $([int]$uploadResponse.StatusCode)"
    }

    $uploadJson = $uploadBody | ConvertFrom-Json
    $uploadedData = $uploadJson.data
    if ($null -eq $uploadedData -or [string]::IsNullOrWhiteSpace([string]$uploadedData.url)) {
        throw 'Upload response did not contain data.url'
    }

    $readbackUrl = [string]$uploadedData.url
    $readbackUri = $null
    if (-not [Uri]::TryCreate($readbackUrl, [UriKind]::Absolute, [ref]$readbackUri)) {
        $readbackUrl = "$base/$($readbackUrl.TrimStart('/'))"
    }

    $readbackBytes = $httpClient.GetByteArrayAsync($readbackUrl).GetAwaiter().GetResult()
    $sourceHash = (Get-FileHash -LiteralPath $fixture -Algorithm SHA256).Hash.ToUpperInvariant()
    $readbackHash = ([Security.Cryptography.SHA256]::Create()).ComputeHash($readbackBytes)
    $readbackHashText = ([BitConverter]::ToString($readbackHash) -replace '-', '').ToUpperInvariant()

    if ($sourceHash -ne $readbackHashText) {
        throw "SHA-256 mismatch. Source=$sourceHash Readback=$readbackHashText"
    }

    Write-Host "[PASS] POST /files -> HTTP $([int]$uploadResponse.StatusCode), object metadata returned"
    Write-Host "[PASS] GET uploaded object -> $($readbackBytes.Length) bytes, SHA-256 matched"
    Write-Host "[INFO] Uploaded probe object: $fileName"
    Write-Host '[INFO] Remove the probe object through the Sardine-approved cleanup process after QA.'
}
finally {
    if ($generatedFixture -and $fixture -and (Test-Path -LiteralPath $fixture)) {
        Remove-Item -LiteralPath $fixture -Force
    }

    if ($form) {
        $form.Dispose()
    }

    $httpClient.Dispose()
}
