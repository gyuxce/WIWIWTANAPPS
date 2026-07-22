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

`DevDatabaseSeeder` also calls `UpdateCourseJapaneseTitlesSeeder` so local course categories get Japanese titles after the Excel seed import. If the database already exists and only those course translations need repair, run:

```powershell
.\scripts\dev-env.ps1
cd backend
php artisan db:seed --class=UpdateCourseJapaneseTitlesSeeder --force
```

Expected local course category translations:

```text
Teori Bahasa Jepang => 日本語理論
Praktik Bahasa Jepang => 日本語実践
Soft Skill Bahasa Jepang => 日本語ソフトスキル
```

Serve the backend:

```powershell
.\scripts\backend-serve.ps1
```

Then open:

```text
http://127.0.0.1:8000
```

Smoke test constants API:

```powershell
curl.exe http://127.0.0.1:8000/api/v1/constants
```

## Local Auth Fallback

The original backend delegates sign-in and token verification to the Dolphin microservice. That service is not required for the current Windows smoke test. When `APP_ENV=local`, the backend can issue and verify local development tokens through `App\Services\Dolphin\LocalAuth`.

This fallback is intentionally local-only. Production and staging should keep using the Dolphin service.

The fallback uses the existing `users` table and stores refresh sessions in the `tokens` table.

Seed CMS admin login:

```text
Email: admin@62teknologi.com
Password: password
```

Seed student/mobile login:

```text
Email: user1@62teknologi.com
Password: password
```

Student accounts have `role_id = null`, so they are intentionally blocked from the CMS. Use student accounts only through the mobile app or mobile API login with `is_mobile=1`.

## CMS Setup

Create local CMS env:

```powershell
Copy-Item cms\.env.example cms\.env
```

Use the local backend API host:

```env
REACT_APP_API_HOST=http://127.0.0.1:8000/api/v1
REACT_APP_DEFAULT_PASSWORD=password
REACT_APP_MAX_UPLOAD_SIZE=5242880
```

Install and start CMS:

```powershell
cd cms
npm install --legacy-peer-deps
npm run start
```

Then open:

```text
http://127.0.0.1:3000
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
- `DevDatabaseSeeder` imports the development Excel seed data and fills local course category `title_japan` values.
- `php artisan serve` responds on `http://127.0.0.1:8000`.
- CMS starts on `http://127.0.0.1:3000`.
- CMS login succeeds with the seed admin account and redirects to `/dashboard`.
