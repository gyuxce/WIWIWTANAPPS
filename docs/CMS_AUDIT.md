# CMS Audit

Last audit: 2026-08-01

Scope: local CMS functional QA after the project owner took over execution from the previous developer.

## Environment

| Component | Value |
| --- | --- |
| Backend API | `http://127.0.0.1:8000` |
| CMS | `http://127.0.0.1:3000` |
| Database | Local SQLite development seed |
| Account | Seed admin account from local README |
| Test data | Temporary records prefixed `QA CMS` and removed after verification |

## Route Smoke Baseline

All main CMS routes opened without an authentication redirect. This is a navigation baseline, not proof that every route is production-ready.

| Area | Routes |
| --- | --- |
| Dashboard and student | `/dashboard`, `/student/list`, `/student/progress`, `/student/payment` |
| Pre-test | `/test/language`, `/test/character`, `/test/qna` |
| Training | `/training/category`, `/training/module`, `/training/list`, `/training/score` |
| Certification and interview | `/certification/list`, `/certification/result`, `/wawancara` |
| Community and communication | `/forum`, `/notification`, `/seminar` |
| Admin and settings | `/management/role`, `/management/user`, `/setting/profile`, `/setting/sistem` |

## Functional Results

| Area | Scenario | Result | Evidence |
| --- | --- | --- | --- |
| User management | Required fields, email format, create, edit, delete | PASS-QA | Temporary user created, renamed, deleted; malformed email shows `Format email tidak valid` |
| Role management | Required name, permission selection, create, readback, delete | PASS-QA | Temporary role with `Materi Pelatihan` permission read back checked, then deleted |
| Training category | Required fields, bilingual create/edit/readback/delete | PASS-QA | Japanese title read back in edit form; temporary category removed |
| Training module | Bilingual create/edit/readback/delete | PASS-QA | Japanese title read back and list display verified |
| Training seed | Existing module rows have Japanese titles | PASS-QA | Seed repair applied; six seeded module rows no longer show `-` |
| Training material | Required fields, create/edit/delete, text content persistence | PASS-QA | Text content reloaded with title, description, and body; temporary material removed |
| Forum | Required fields, topic selection, publish, detail, delete | PASS-QA | Temporary post reached detail page and was deleted with cleanup reason |
| Seminar | Required fields, date picker, create/detail/edit/delete | PASS-QA | Temporary seminar read back date, description, link, edit result, then removed |
| Notification | Required fields, schedule, repeat, target all users, create/edit/delete | PASS-QA | Temporary notification read back; link persistence verified after backend fix; then removed |

## Fixes Applied

- CMS logout now clears the local session in a `finally` block when an old refresh token cannot be revoked.
- CMS user validation trims name/email and rejects malformed email addresses.
- Seminar empty date validation now returns `Wajib diisi` instead of a Yup type error.
- Notification API validation now accepts and persists optional valid `link` values; the empty `send_at` message uses the required-field message.
- Japanese course item seed values were repaired so seeded titles are readable and no longer mojibake.
- The existing `course_items.title_japan` migration was applied to the local QA database before module CRUD verification. The migration file already exists in source; deployment migration execution still needs a release check.

## Defects And Risks

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| CMS-DEF-001 | P2 | Old CMS refresh token could prevent logout cleanup when the revoke API failed | Closed; local session cleanup fixed and browser retest clean |
| CMS-DEF-002 | P1 | Local database was missing the existing `course_items.title_japan` column until its domain migration was applied | Open release risk; verify all domain migrations run on staging/production |
| CMS-DEF-003 | P2 | Japanese seed literals contained mojibake and displayed as unreadable text | Closed in seed source; rerun seed on target environments |
| CMS-DEF-004 | P3 | Training material edit toast says `Berhasil membuat data` although the edit succeeds | Open copy issue; no data loss observed |
| CMS-DEF-005 | P3 | Existing source lint baseline still reports unrelated legacy errors; build command was previously slow/timeout-prone | Open technical debt; run release build on a dedicated machine |

## Gaps Still Open

These areas have route smoke evidence or mobile evidence but do not yet have complete CMS CRUD/UAT evidence:

- Virtual class CMS create/edit/detail/status.
- Assessment template, question, and publish flow.
- Upload validation and storage readback for cover, video, and document files.
- Full non-admin permission matrix, including a real restricted CMS role login.
- Export/import and pagination/filter boundary cases.
- Staging/production migration, storage, Firebase, payment, and scheduled notification verification.

## QA Interpretation

The tested CMS core content flows are `PASS-QA` for local development. This does not yet mean the full CMS is release-ready: the open P1 migration verification, virtual class, assessment, uploads, permission matrix, and production configuration gates remain. Do not mark those items `PASS-UAT` without client/product-owner evidence.

## Next Gate

1. Run the full migration set on a clean staging database and verify `course_items.title_japan` plus all notification tables.
2. Finish virtual class and assessment CRUD tests.
3. Test upload and storage readback with safe QA files.
4. Execute a restricted-role permission matrix.
5. Build and test the release candidate, then complete signing and Play Console preparation.
