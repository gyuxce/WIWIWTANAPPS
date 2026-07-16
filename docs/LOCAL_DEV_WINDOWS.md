# Local Development on Windows

This project can run on Windows for backend smoke testing with portable tools and SQLite.

## Current Local Tooling

The local Codex workspace uses portable tools outside the repo:

- PHP 8.2.32
- Composer 2.10.2
- Node.js 18.20.8

The repo scripts expect those tools at `../tools` relative to the repo folder.

## Backend Setup

Install dependencies:

```powershell
.\scripts\backend-composer-install.ps1
```

Create local backend env:

```powershell
Copy-Item backend\.env.example backend\.env
```

For lightweight Windows development, use SQLite in `backend/.env`:

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
DB_DATABASE=C:/absolute/path/to/backend/database/database.sqlite
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
TELESCOPE_ENABLED=false
```

Generate `APP_KEY` if needed:

```powershell
.\scripts\dev-env.ps1
cd backend
php -r "echo 'base64:'.base64_encode(random_bytes(32));"
```

Put the generated value into `APP_KEY`.

Run migrations:

```powershell
.\scripts\backend-migrate-sqlite.ps1
```

Seed development data:

```powershell
.\scripts\dev-env.ps1
cd backend
php artisan db:seed --class=DevDatabaseSeeder --force
```

Serve the backend:

```powershell
.\scripts\backend-serve.ps1
```

Then open:

```text
http://127.0.0.1:8000
```

## Windows Notes

Laravel Horizon requires `pcntl` and `posix`, which are Linux/Unix PHP extensions. On Windows development, Composer install uses:

```powershell
--ignore-platform-req=ext-pcntl --ignore-platform-req=ext-posix
```

Production should still run on Linux with the proper PHP extensions and queue process setup.

## Verified Locally

- Laravel boots with PHP 8.2.32.
- Composer dependencies install.
- SQLite migrations run when each migration subfolder is called explicitly.
- `DevDatabaseSeeder` imports the development Excel seed data.
- `php artisan serve` responds on `http://127.0.0.1:8000`.
