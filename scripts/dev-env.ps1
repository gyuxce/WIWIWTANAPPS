$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$WorkspaceRoot = Resolve-Path (Join-Path $RepoRoot "..")
$ToolsRoot = Join-Path $WorkspaceRoot "tools"

$PhpRoot = Join-Path $ToolsRoot "php-8.2.32"
$NodeRoot = Join-Path $ToolsRoot "node-v18.20.8-win-x64"
$ComposerPhar = Join-Path $ToolsRoot "composer.phar"

if (!(Test-Path (Join-Path $PhpRoot "php.exe"))) {
    throw "Portable PHP not found at $PhpRoot"
}

if (!(Test-Path (Join-Path $NodeRoot "node.exe"))) {
    throw "Portable Node.js not found at $NodeRoot"
}

if (!(Test-Path $ComposerPhar)) {
    throw "Composer phar not found at $ComposerPhar"
}

$env:PATH = "$PhpRoot;$NodeRoot;$env:PATH"

Write-Host "Loaded Wiwitan portable dev environment"
Write-Host "PHP:      $PhpRoot"
Write-Host "Node.js:  $NodeRoot"
Write-Host "Composer: $ComposerPhar"
