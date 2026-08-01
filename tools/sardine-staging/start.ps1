param(
    [string] $PhpPath = $env:WIWITAN_PHP_EXE
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($PhpPath)) {
    $phpCommand = Get-Command php -ErrorAction SilentlyContinue
    if ($null -eq $phpCommand) {
        throw 'PHP was not found. Pass -PhpPath or set WIWITAN_PHP_EXE.'
    }
    $PhpPath = $phpCommand.Source
}

$serviceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $serviceRoot 'runtime'
New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null

$stdoutPath = Join-Path $runtimeRoot 'server.out.log'
$stderrPath = Join-Path $runtimeRoot 'server.err.log'
$arguments = @('-S', '127.0.0.1:9003', 'router.php')
$process = Start-Process -FilePath $PhpPath -ArgumentList $arguments -WorkingDirectory $serviceRoot -WindowStyle Hidden -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -PassThru

Write-Output "Sardine staging started: PID $($process.Id)"
Write-Output 'Endpoint: http://127.0.0.1:9003'
