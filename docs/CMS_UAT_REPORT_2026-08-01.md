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
| Upload/storage | Category cover, Virtual Class cover, Assessment video, student document | Local Sardine staging adapter | File pointers, CMS/API readback, authenticated document download | All source/readback byte hashes matched | PASS-QA; production dependency CMS-DEF-009 |

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
9. Virtual Class cover upload persisted the Sardine URL and `cover_file_id`; the source and storage readback both measured 346 bytes with matching SHA-256.
10. Assessment video upload persisted the course-item file pointer only after the upload request completed; the 28-byte storage fixture read back with a matching SHA-256. Real video playback remains a separate release check.
11. Student document upload no longer rewrites the Sardine URL to Google Cloud Storage. Authenticated upload and download read back the 7,944-byte fixture with a matching SHA-256.
12. The Virtual Class date-picker `OK` button was changed to `type="button"`; browser retest confirmed date selection does not submit the parent form or create an incomplete class.

## Open Scope

- Assessment verbal schedule and full publish evidence.
- Real MP4 playback and production storage readback against the approved Sardine endpoint; local upload/readback coverage now passes for category cover, Virtual Class cover, Assessment video, and student documents.
- Direct API/action-level permission checks beyond the route/menu matrix.
- Production migration and service configuration.

## Decision

CMS core content flows, module archive behavior, clean migration staging, CMS production build, and local Sardine storage readback are ready for the next release-candidate gate on local development. The project is not yet release-ready because the approved Sardine production endpoint, real MP4 playback evidence, production configuration, and formal UAT evidence are still outstanding.
