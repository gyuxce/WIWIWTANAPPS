# Internal UAT Report - WIWITAN Apps

Tanggal eksekusi: 1 Agustus 2026
Status: **CONDITIONAL PASS - INTERNAL ONLY**
Related plan: [QA_UAT_TEST_PLAN.md](QA_UAT_TEST_PLAN.md)
Client pack: [UAT_CLIENT_EXECUTION_PACK.md](UAT_CLIENT_EXECUTION_PACK.md)

## 1. Arti Status

Laporan ini adalah hasil pengujian internal menggunakan source, seed lokal, backend lokal, CMS build lokal, dan emulator Android. Status ini bukan persetujuan client dan bukan bukti bahwa environment production sudah siap.

- `PASS`: gate internal berhasil pada eksekusi ini.
- `PASS-SMOKE`: flow pernah berjalan pada smoke test lokal, tetapi belum menjadi UAT client.
- `BLOCKED`: ada dependency release atau environment yang belum tersedia.
- `PENDING`: perlu fixture, data, atau pengujian tambahan.

## 2. Environment

| Item | Nilai |
| --- | --- |
| Backend | `http://127.0.0.1:8000` |
| API probe | `GET /api/v1/constants/` -> HTTP 200 |
| CMS | Production build berhasil; runtime manual belum diuji ulang pada run ini |
| Mobile package | `com.wiwitanbaru.wiwitan.dev` |
| APK | `app-development-qa.apk` |
| Emulator | `emulator-5554` |
| Android | SDK Platform 35, NDK `28.2.13676358` |

## 3. Internal Test Results

| ID | Area | Test dan evidence | Result |
| --- | --- | --- | --- |
| INT-ENV-001 | Backend API | `GET /api/v1/constants/` dan root backend merespons HTTP 200 | PASS |
| INT-ENV-002 | Backend test | `php artisan test --no-coverage` -> 2 tests, 2 assertions passed | PASS |
| INT-ENV-003 | CMS build | `npm run build` compiled successfully dan menghasilkan folder build | PASS |
| INT-ENV-004 | Mobile TypeScript | `corepack yarn tsc --noEmit --pretty false` selesai tanpa error | PASS |
| INT-ENV-005 | Encoding | `scripts/check-mojibake.py` -> `No mojibake candidates found` | PASS |
| INT-ENV-006 | Secret hygiene | `.env`, `google-services.json`, dan keystore lokal tidak tracked | PASS |
| INT-ENV-007 | Migration/seed reproducibility | Fresh SQLite sementara menjalankan migrate:fresh, seluruh domain migration, DevDatabaseSeeder, dan UpdateCourseJapaneseTitlesSeeder tanpa error | PASS |
| INT-MOB-001 | APK QA | `app:assembleDevelopmentQa` berhasil; APK ter-install ke emulator | PASS |
| INT-MOB-002 | Mobile launch/session | `MainActivity` resumed, proses hidup, log memuat student profile dan route `HomeScreen`, tanpa fatal exception | PASS-SMOKE |
| INT-MOB-003 | Student core routes | Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch pernah lulus smoke test emulator | PASS-SMOKE |
| INT-MOB-004 | Negative/lifecycle | Credential salah, logout, API unavailable, expired/invalid session, access boundary, permission denial, background/resume, dan rotation sudah diuji | PASS-SMOKE |
| INT-CMS-001 | CMS/admin | Login admin dan flow CMS dasar sudah pernah diaudit; runtime CRUD lengkap tetap perlu retest dengan fixture internal | PASS-SMOKE |
| INT-REL-001 | Production AAB | Compile/native/R8 lulus; task berhenti pada release signing karena keystore dan `MYAPP_UPLOAD_*` belum tersedia | BLOCKED |

## 4. Internal Decision

Internal QA baseline: **CONDITIONAL PASS**.

Artinya core flow dan environment lokal cukup untuk melanjutkan test cycle, tetapi belum boleh disebut siap publish. Dua gate besar masih terpisah:

1. Client UAT masih pending karena acceptance criteria, data bisnis, akun, dan reviewer belum diberikan.
2. Google Play release masih blocked karena keystore upload, credential signing, production environment, dan Play Console belum lengkap.

## 5. Open Issues

| ID | Severity | Issue | Status |
| --- | --- | --- | --- |
| DEF-001 | P2 | Jest legacy membutuhkan mock native SDK yang belum lengkap | Blocked - test infrastructure |
| DEF-002 | P2 | Toast `Error internal server` transient saat startup/recovery; endpoint pemicu belum terisolasi | Open |
| QA-ENV-002 | P1 | Reproducibility migration/seed sudah dibuktikan pada fresh SQLite sementara | Closed - PASS |
| QA-NEG-004 | P1 | Fixture backend null/incomplete belum diuji end-to-end | Pending |
| QA-NEG-005 | P2 | Network lambat belum diuji dengan shaping terkontrol | Pending |
| QA-NEG-006 | P1 | Double tap submit belum diuji dengan fixture yang aman | Pending |
| REL-001 | P0 | Production keystore dan credential upload belum tersedia | Blocked |

## 6. Batasan Pengujian

- Data yang dipakai adalah seed/local data, bukan data bisnis resmi client.
- Login mobile pada sebagian smoke run memakai konfigurasi auto-login QA lokal.
- Belum ada validasi device fisik, push notification production, storage production, payment production, atau Play Console.
- Hasil internal tidak menggantikan sign-off dari client/product owner.
- Backend local `.env` sempat menunjuk ke absolute path database dari workspace lama; path lokal sudah diarahkan ke workspace aktif dan file `.env` tetap tidak di-commit.

## 7. Next Internal Test Cycle

1. Jalankan fixture null/incomplete, network lambat, dan double tap submit.
2. Nyalakan CMS untuk retest CRUD content, user, role, permission, dan validation.
3. Ulangi student flow dari fresh install/session tanpa auto-login bila akun lokal tersedia.
4. Setelah internal gate stabil, minta client mengisi acceptance criteria dan data UAT.
5. Setelah signing tersedia, build AAB production dan jalankan release smoke test.
