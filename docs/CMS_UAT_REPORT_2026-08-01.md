# CMS Internal QA Report - 2026-08-01

## Summary

The CMS core content-management flows were executed on the local backend and CMS after the project owner took over implementation. All temporary QA records were removed after verification, including a final local database fixture sweep.

## Tested Scope

| Module | Create | Read/detail | Edit | Delete | Status |
| --- | --- | --- | --- | --- | --- |
| Users | Yes | Yes | Yes | Yes | PASS-QA |
| Roles and permissions | Yes | Yes | Yes | Yes | PASS-QA |
| Training category | Yes | Yes | Yes | Yes | PASS-QA |
| Training module | Yes | Yes | Yes | Yes | PASS-QA |
| Training module deletion lifecycle | Parent delete | Descendant archive check | Not applicable | Structural descendants archived | PASS-QA |
| Training material and text content | Yes | Yes | Yes | Yes | PASS-QA |
| Virtual class | Yes | Yes | Yes | Yes | PASS-QA |
| Assessment package/question | Yes | Yes | Yes | Yes | PASS-QA |
| Forum post | Yes | Yes | Not applicable | Yes | PASS-QA |
| Seminar | Yes | Yes | Yes | Yes | PASS-QA |
| Notification content | Yes | Yes | Yes | Yes | PASS-QA |
| Restricted role permission matrix | Yes | Yes | Route denial | Not applicable | PASS-QA |
| Upload/storage | Safe category cover fixture | Local Sardine staging adapter | CMS cover readback | Byte hash matched | PASS-QA; production dependency CMS-DEF-009 |

## Validation Evidence

- User form rejects malformed email with `Format email tidak valid`.
- Required fields on user, category, material, forum, seminar, and notification forms display user-facing validation messages.
- Seminar empty date fields now display `Wajib diisi` after replacing the incorrect Yup string schema.
- Notification schedule, repeat option, and all-student target were submitted successfully.

## Defects Closed During This Run

1. Notification `link` was accepted by the CMS but dropped by backend request validation. The backend now validates an optional URL and the value was confirmed in edit readback.
2. CMS logout now clears local auth state even if refresh-token revocation fails.
3. Japanese course item seed values were repaired and read back in the module list.
4. Local training module creation was blocked by an unapplied existing `title_japan` migration. The migration and full domain set now pass clean SQLite staging; production migration execution remains a release gate.
5. Virtual Class create stayed on the form because its local `PageConfig.url` was empty. The redirect now returns to the parent module tab and was retested.

6. Module deletion now recursively archives the parent and structural descendants. Browser delete and transaction-level regression passed; active descendant/orphan counts returned zero while progress, question-bank, and file records remain preserved.
7. Clean migration staging initially exposed a duplicate `tokens` table definition. Migration order and Dolphin ownership were corrected; a clean run of all domain migrations and seeders now passes.
8. Restricted-role login with only `Materi Pelatihan` permission showed training navigation and denied `/forum` plus `/management/user` after asynchronous permissions loaded.

## Open Scope

- Virtual class cover upload and status edge cases.
- Assessment verbal schedule, video upload, and full publish evidence.
- Video/document upload and production storage readback; category cover passed against the local `tools/sardine-staging` adapter at `127.0.0.1:9003`.
- Direct API/action-level permission checks beyond the route/menu matrix.
- Production migration and service configuration.

## Decision

CMS core content flows, module archive behavior, clean migration staging, CMS production build, and category cover storage readback are ready for the next release-candidate gate on local development. The project is not yet release-ready because the approved Sardine production endpoint is not configured, video/document coverage is incomplete, production configuration is not verified, and formal UAT evidence still needs to be attached.
