# Sardine Production QA

Status: **blocked pending the approved Sardine endpoint and its access contract**

The active local backend currently uses `SARDINE_BASEURL=http://127.0.0.1:9003`,
which is the local QA adapter. The repository does not contain the approved
production URL, credentials, service token, or the missing `62sardine` binary.
Do not point the local database at production until the storage owner confirms
the endpoint and test-data policy.

## Required From The Storage Owner

Provide these values through a secure channel. Do not commit them to Git:

| Item | Required detail |
| --- | --- |
| Endpoint | Sardine base URL whose `/health` and `/files` paths are valid |
| Environment | Staging or production, region, and expected data-retention policy |
| Authentication | Whether the current contract needs a bearer token, API key, mTLS, or network allowlist; include the exact header/config name |
| Test folder | Approved remote folder/prefix for probe objects |
| Cleanup | Sardine console/API procedure for deleting probe objects |
| Limits | Maximum file size, supported MIME types, public/private URL behavior, and resize rules |

The current PHP client sends `Accept: application/json` and does not send an
authentication header. A `401` or `403` from the official endpoint is therefore
an integration-contract blocker, not a reason to put an unknown token into the
repository.

## Safe Probe

The probe mirrors the backend contract and defaults to health-only mode:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\verify-sardine-endpoint.ps1 `
  -BaseUrl 'https://OFFICIAL-SARDINE-BASE-URL'
```

After the storage owner approves a test folder, run upload and byte readback
with a small fixture:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\verify-sardine-endpoint.ps1 `
  -BaseUrl 'https://OFFICIAL-SARDINE-BASE-URL' `
  -RunUploadReadback `
  -FixturePath '.\cms\public\logo192.png' `
  -RemoteFolder 'qa/wiwitan'
```

The command checks HTTP health, multipart upload, the returned `data.url`,
downloaded bytes, and SHA-256 equality. It does not delete the remote object;
use the approved Sardine cleanup process afterward.

## Application Retest

After the probe passes:

1. Set `SARDINE_BASEURL` in the local, untracked `backend/.env` only.
2. Run `php artisan config:clear` and restart the backend process.
3. Repeat CMS category-cover, Virtual Class-cover, and Assessment-video upload.
4. Repeat student document upload and authenticated download.
5. Verify each database file row stores the official Sardine URL and that the UI can read it back.
6. Restore the local adapter URL after testing unless this environment is intentionally reserved for official staging.

The final release gate remains open until the official endpoint passes the probe,
the same four application paths pass against it, and a real playable MP4 is
verified. Local adapter results are not production evidence.
