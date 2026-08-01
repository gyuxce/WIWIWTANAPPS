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
| Training module deletion lifecycle | Parent delete and descendant cleanup | BLOCKED | Parent soft-delete passed, but generated assessment child rows remained active and required a local database fixture sweep |
| Training seed | Existing module rows have Japanese titles | PASS-QA | Seed repair applied; six seeded module rows no longer show `-` |
| Training material | Required fields, create/edit/delete, text content persistence | PASS-QA | Text content reloaded with title, description, and body; temporary material removed |
| Virtual class | Required fields, date picker, create/detail/edit/delete, link | PASS-QA | Temporary class returned to the module tab after the redirect fix and was removed |
| Assessment package/question | Package create/readback/edit/delete, question add/save/readback/remove, activation toggle | PASS-QA | Temporary package and question were removed; seeded assessment status was restored |
| Forum | Required fields, topic selection, publish, detail, delete | PASS-QA | Temporary post reached detail page and was deleted with cleanup reason |
| Seminar | Required fields, date picker, create/detail/edit/delete | PASS-QA | Temporary seminar read back date, description, link, edit result, then removed |
| Notification | Required fields, schedule, repeat, target all users, create/edit/delete | PASS-QA | Temporary notification read back; link persistence verified after backend fix; then removed |

## Fixes Applied

- CMS logout now clears the local session in a `finally` block when an old refresh token cannot be revoked.
- CMS user validation trims name/email and rejects malformed email addresses.
- Seminar empty date validation now returns `Wajib diisi` instead of a Yup type error.
- Notification API validation now accepts and persists optional valid `link` values; the empty `send_at` message uses the required-field message.
- Virtual class create/edit now returns to the parent module's `Kelas Virtual` tab instead of staying on a blank-route form.
- Japanese course item seed values were repaired so seeded titles are readable and no longer mojibake.
- The existing `course_items.title_japan` migration was applied to the local QA database before module CRUD verification. The migration file already exists in source; deployment migration execution still needs a release check.
- The final local QA fixture sweep removed temporary parent, child assessment, virtual-class, material, article, question, and notification records; all matching active and soft-deleted QA counts returned zero.

## Defects And Risks

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| CMS-DEF-001 | P2 | Old CMS refresh token could prevent logout cleanup when the revoke API failed | Closed; local session cleanup fixed and browser retest clean |
| CMS-DEF-002 | P1 | Local database was missing the existing `course_items.title_japan` column until its domain migration was applied | Open release risk; verify all domain migrations run on staging/production |
| CMS-DEF-003 | P2 | Japanese seed literals contained mojibake and displayed as unreadable text | Closed in seed source; rerun seed on target environments |
| CMS-DEF-004 | P3 | Training material edit toast says `Berhasil membuat data` although the edit succeeds | Open copy issue; no data loss observed |
| CMS-DEF-005 | P3 | Existing source lint baseline still reports unrelated legacy errors; build command was previously slow/timeout-prone | Open technical debt; run release build on a dedicated machine |
| CMS-DEF-006 | P1 | Notification link was dropped because backend request validation omitted the optional field | Closed; URL rule added and edit readback verified |
| CMS-DEF-007 | P2 | Virtual class create succeeded but `PageConfig.url` was empty, so the UI stayed on the form after save | Closed; redirect now returns to the parent module virtual tab |
| CMS-DEF-008 | P1 | Deleting a training module soft-deletes the parent but leaves generated assessment child `course_items` active; the UI warning says related records are deleted | Open; define retention policy and implement/test backend descendant cleanup before production content deletion |

## Gaps Still Open

These areas have route smoke evidence or mobile evidence but do not yet have complete CMS CRUD/UAT evidence:

- Virtual class cover upload and status edge cases.
- Assessment verbal schedule, video upload, and full publish/activation evidence.
- Upload validation and storage readback for cover, video, and document files.
- Full non-admin permission matrix, including a real restricted CMS role login.
- Export/import and pagination/filter boundary cases.
- Training module deletion cascade/archive behavior and related progress/history retention.
- Staging/production migration, storage, Firebase, payment, and scheduled notification verification.

## QA Interpretation

The tested CMS core content flows are `PASS-QA` for local development, with module deletion lifecycle still blocked by `CMS-DEF-008`. This does not yet mean the full CMS is release-ready: migration verification, remaining assessment/upload coverage, permission matrix, data-retention policy, and production configuration gates remain. Do not mark those items `PASS-UAT` without client/product-owner evidence.

## Next Gate

1. Define and implement the module deletion cascade/archive policy, then retest `CMS-DEF-008` with database evidence.
2. Run the full migration set on a clean staging database and verify `course_items.title_japan` plus all notification tables.
3. Finish virtual class cover/status and assessment verbal/video tests.
4. Test upload and storage readback with safe QA files.
5. Execute a restricted-role permission matrix.
6. Build and test the release candidate, then complete signing and Play Console preparation.
