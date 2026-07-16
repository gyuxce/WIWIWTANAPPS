. "$PSScriptRoot\dev-env.ps1"

Push-Location (Join-Path $RepoRoot "backend")
try {
    php artisan serve --host=127.0.0.1 --port=8000
}
finally {
    Pop-Location
}
