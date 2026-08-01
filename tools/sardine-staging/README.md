# Sardine Staging Adapter

This is a **local QA-only** adapter for the small Sardine contract used by the
Wiwitan backend. It is not a replacement for the approved production Sardine
service and must not be exposed outside the local machine.

## Start

From the repository root in PowerShell:

```powershell
$env:WIWITAN_PHP_EXE = 'C:\path\to\php.exe'
powershell -ExecutionPolicy Bypass -File .\tools\sardine-staging\start.ps1
```

The current workspace PHP executable can be passed directly:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\sardine-staging\start.ps1 `
  -PhpPath 'C:\Users\yugeg\Documents\Codex\2026-07-16\dap\work\tools\php-8.2.32\php.exe'
```

## Contract

- `GET http://127.0.0.1:9003/health`
- `POST http://127.0.0.1:9003/files` with multipart field `file`
- `GET http://127.0.0.1:9003/files/{id}` for byte readback

Uploaded bytes and metadata are stored under `runtime/`, which is ignored by
Git. The adapter accepts the folder, visibility, and basic file metadata used
by the backend. It does not implement production resizing, cloud durability,
ACLs, backups, or retention guarantees.

Before release, replace `SARDINE_BASEURL` with the approved Sardine staging or
production endpoint and execute upload/readback again against that service.
