. "$PSScriptRoot\dev-env.ps1"

$BackendRoot = Join-Path $RepoRoot "backend"
$DatabaseRoot = Join-Path $BackendRoot "database"
$SqliteDatabase = Join-Path $DatabaseRoot "database.sqlite"
$TelescopeDatabase = Join-Path $DatabaseRoot "database.sqlite_telescope"

if (!(Test-Path $SqliteDatabase)) {
    New-Item -ItemType File -Path $SqliteDatabase | Out-Null
}

if (!(Test-Path $TelescopeDatabase)) {
    New-Item -ItemType File -Path $TelescopeDatabase | Out-Null
}

Push-Location $BackendRoot
try {
    php artisan config:clear
    php artisan migrate --force --no-interaction

    $paths = @(
        "database/migrations/Base",
        "database/migrations/Master",
        "database/migrations/Finance",
        "database/migrations/Forum",
        "database/migrations/Training",
        "database/migrations/TableRefs"
    )

    foreach ($path in $paths) {
        php artisan migrate --path=$path --force --no-interaction
    }
}
finally {
    Pop-Location
}
