# CMS Audit

Last audit: 2026-07-17

Environment:

- Backend: `http://127.0.0.1:8000`
- CMS: `http://127.0.0.1:3000`
- Login: seed admin account
- Database: local SQLite development seed

## Route Smoke Test

All main CMS navigation routes opened successfully without redirecting to login.

| Route | Result |
| --- | --- |
| `/dashboard` | OK |
| `/student/list` | OK |
| `/student/progress` | OK |
| `/student/payment` | OK |
| `/test/language` | OK |
| `/test/character` | OK |
| `/test/qna` | OK |
| `/training/category` | OK |
| `/training/module` | OK |
| `/training/list` | OK |
| `/training/score` | OK |
| `/certification/list` | OK |
| `/certification/result` | OK |
| `/wawancara` | OK |
| `/forum` | OK |
| `/notification` | OK |
| `/seminar` | OK |
| `/management/role` | OK |
| `/management/user` | OK |
| `/setting/profile` | OK |
| `/setting/sistem` | OK |

## Fixes Applied

- Fixed dashboard statistics API error when seeded `user_mobile_usages.date` contains Excel serial date values.
- Normalized progress values before passing them to React `Progress` components.
- Removed invalid `loading` attributes from native buttons in settings pages.

## Notes

- Some pages show `No data available`; this is expected with the current development seed.
- The audit covered list/index pages only. Create, edit, delete, export, import, upload, and detail flows still need separate interaction tests.
- Production/staging still need Dolphin microservice, external storage, Firebase, and payment/service credentials configured.
