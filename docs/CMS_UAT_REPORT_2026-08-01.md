# CMS Internal QA Report - 2026-08-01

## Summary

The CMS core content-management flows were executed on the local backend and CMS after the project owner took over implementation. All temporary QA records were removed after verification.

## Tested Scope

| Module | Create | Read/detail | Edit | Delete | Status |
| --- | --- | --- | --- | --- | --- |
| Users | Yes | Yes | Yes | Yes | PASS-QA |
| Roles and permissions | Yes | Yes | Yes | Yes | PASS-QA |
| Training category | Yes | Yes | Yes | Yes | PASS-QA |
| Training module | Yes | Yes | Yes | Yes | PASS-QA |
| Training material and text content | Yes | Yes | Yes | Yes | PASS-QA |
| Forum post | Yes | Yes | Not applicable | Yes | PASS-QA |
| Seminar | Yes | Yes | Yes | Yes | PASS-QA |
| Notification content | Yes | Yes | Yes | Yes | PASS-QA |

## Validation Evidence

- User form rejects malformed email with `Format email tidak valid`.
- Required fields on user, category, material, forum, seminar, and notification forms display user-facing validation messages.
- Seminar empty date fields now display `Wajib diisi` after replacing the incorrect Yup string schema.
- Notification schedule, repeat option, and all-student target were submitted successfully.

## Defects Closed During This Run

1. Notification `link` was accepted by the CMS but dropped by backend request validation. The backend now validates an optional URL and the value was confirmed in edit readback.
2. CMS logout now clears local auth state even if refresh-token revocation fails.
3. Japanese course item seed values were repaired and read back in the module list.
4. Local training module creation was blocked by an unapplied existing `title_japan` migration. The migration was applied locally; staging/production migration execution remains a release gate.

## Open Scope

- Virtual class CMS CRUD.
- Assessment template/question/publish flow.
- Upload/storage readback.
- Restricted-role permission matrix.
- Production migration and service configuration.

## Decision

CMS core content flows are ready for the next internal QA gate on local development. The project is not yet a full release candidate until the open scope and production gates are completed.
