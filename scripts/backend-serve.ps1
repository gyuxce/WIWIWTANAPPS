. "$PSScriptRoot\dev-env.ps1"

Push-Location (Join-Path $RepoRoot "backend")
try {
    php artisan serve --host=0.0.0.0 --port=8000
}
finally {
    Pop-Location
}
