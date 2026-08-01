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
| Test data | Temporary records prefixed `QA CMS`; final local database fixture sweep verified zero active or soft-deleted QA rows |

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
| Training module deletion lifecycle | Parent delete and descendant archive | PASS-QA | UI delete retest plus SQLite evidence: parent and generated assessment descendants archived; zero active child rows or QA orphans |
| Training seed | Existing module rows have Japanese titles | PASS-QA | Seed repair applied; six seeded module rows no longer show `-` |
| Training material | Required fields, create/edit/delete, text content persistence | PASS-QA | Text content reloaded with title, description, and body; temporary material removed |
| Virtual class | Required fields, date picker, create/detail/edit/delete, link | PASS-QA | Temporary class returned to the module tab after the redirect fix and was removed |
| Assessment package/question | Package create/readback/edit/delete, question add/save/readback/remove, activation toggle | PASS-QA | Temporary package and question were removed; seeded assessment status was restored |
| Forum | Required fields, topic selection, publish, detail, delete | PASS-QA | Temporary post reached detail page and was deleted with cleanup reason |
| Seminar | Required fields, date picker, create/detail/edit/delete | PASS-QA | Temporary seminar read back date, description, link, edit result, then removed |
| Notification | Required fields, schedule, repeat, target all users, create/edit/delete | PASS-QA | Temporary notification read back; link persistence verified after backend fix; then removed |
| Restricted role | Training-only role can access training routes but is denied forum and user management | PASS-QA | Temporary role/user readback; permissions loaded asynchronously and both denied routes rendered `Access Denied`; no browser warnings |
| Upload/storage | Category cover upload, storage response, and byte readback | PASS-QA (local staging) | Local `tools/sardine-staging` endpoint returned metadata, CMS saved `cover_id`, edit readback returned the staging URL, and source/readback SHA-256 matched |

## Fixes Applied

- CMS logout now clears the local session in a `finally` block when an old refresh token cannot be revoked.
- CMS user validation trims name/email and rejects malformed email addresses.
- Seminar empty date validation now returns `Wajib diisi` instead of a Yup type error.
- Notification API validation now accepts and persists optional valid `link` values; the empty `send_at` message uses the required-field message.
- Virtual class create/edit now returns to the parent module's `Kelas Virtual` tab instead of staying on a blank-route form.
- Training module deletion now archives structural descendants recursively before soft-deleting the parent; student progress, question-bank data, and file records are preserved.
- Japanese course item seed values were repaired so seeded titles are readable and no longer mojibake.
- The existing `course_items.title_japan` migration was verified in clean SQLite staging together with the full domain migration set; production migration execution still needs the release environment check.
- The migration runner now executes Base before Dolphin and guards the legacy Dolphin token table so clean staging creates the modern `tokens` schema once.
- CMS lint now ignores generated `build/` output; the changed virtual-class source file passes targeted ESLint.
- The final local QA fixture sweep removed temporary parent, child assessment, virtual-class, material, article, question, and notification records; all matching active and soft-deleted QA counts returned zero.

## Defects And Risks

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| CMS-DEF-001 | P2 | Old CMS refresh token could prevent logout cleanup when the revoke API failed | Closed; local session cleanup fixed and browser retest clean |
| CMS-DEF-002 | P1 | Local database was missing the existing `course_items.title_japan` column until its domain migration was applied | Open production risk; clean staging now passes, production migration execution remains to be verified |
| CMS-DEF-003 | P2 | Japanese seed literals contained mojibake and displayed as unreadable text | Closed in seed source; rerun seed on target environments |
| CMS-DEF-004 | P3 | Training material edit toast says `Berhasil membuat data` although the edit succeeds | Open copy issue; no data loss observed |
| CMS-DEF-005 | P3 | Existing source lint baseline still reports unrelated legacy errors; production build is valid but full lint remains noisy | Open technical debt; production build passed, while 33 legacy source lint errors remain |
| CMS-DEF-006 | P1 | Notification link was dropped because backend request validation omitted the optional field | Closed; URL rule added and edit readback verified |
| CMS-DEF-007 | P2 | Virtual class create succeeded but `PageConfig.url` was empty, so the UI stayed on the form after save | Closed; redirect now returns to the parent module virtual tab |
| CMS-DEF-008 | P1 | Deleting a training module soft-deletes the parent but leaves generated assessment child `course_items` active; the UI warning says related records are deleted | Closed; recursive structural archive implemented, UI delete retested, and database evidence showed zero active descendants/orphans |
| CMS-DEF-009 | P1 | The repository does not contain the approved `62sardine` binary or production Sardine endpoint configuration | Open production dependency; local staging adapter now passes category cover upload/readback, but replace it with the approved Sardine service before release |
| CMS-DEF-010 | P1 | Clean migration runner defined the `tokens` table in both Dolphin and Base paths | Closed; Base runs first and Dolphin skips an existing token table; clean migration/seed staging passed |

## Gaps Still Open

These areas have route smoke evidence or mobile evidence but do not yet have complete CMS CRUD/UAT evidence:

- Virtual class cover upload and status edge cases.
- Assessment verbal schedule, video upload, and full publish/activation evidence.
- Video/document upload validation and production storage readback; category cover is covered by local staging evidence.
- Direct API/action-level permission checks for create/update/delete remain separate from the route/menu matrix.
- Export/import and pagination/filter boundary cases.
- Staging/production storage, Firebase, payment, and scheduled notification verification.

## QA Interpretation

The tested CMS core content flows and module archive lifecycle are `PASS-QA` for local development. The CMS production build, clean seeded migration staging, and category cover readback through the local staging adapter also pass. The release candidate remains blocked by the unconfigured approved Sardine production dependency, incomplete assessment/upload coverage, production configuration, and auditable UAT evidence. Do not mark those items `PASS-UAT` without client/product-owner evidence.

## Next Gate

1. Provide the approved Sardine staging/production endpoint, credentials, and retention policy; rerun upload/readback against it and close `CMS-DEF-009`.
2. Finish virtual class cover/status and assessment verbal/video tests.
3. Add direct API/action-level permission checks for the restricted-role matrix.
4. Attach formal UAT evidence and known-issue approval.
5. Tag the CMS release candidate with backend migration, seed, environment, and checksum metadata.
6. Complete production configuration, signing, and Play Console preparation.
