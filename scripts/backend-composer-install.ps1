. "$PSScriptRoot\dev-env.ps1"

Push-Location (Join-Path $RepoRoot "backend")
try {
    php $ComposerPhar install --no-interaction --prefer-dist --ignore-platform-req=ext-pcntl --ignore-platform-req=ext-posix
}
finally {
    Pop-Location
}
