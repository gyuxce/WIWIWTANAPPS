# Internal UAT Report - WIWITAN Apps

Tanggal eksekusi: 1 Agustus 2026
Status: **CONDITIONAL PASS - INTERNAL QA; CLIENT UAT APPROVAL REPORTED**
Related plan: [QA_UAT_TEST_PLAN.md](QA_UAT_TEST_PLAN.md)
Client pack: [UAT_CLIENT_EXECUTION_PACK.md](UAT_CLIENT_EXECUTION_PACK.md)

Catatan approval: project owner melaporkan client UAT sudah `Approved` pada 1 Agustus 2026. Nama reviewer, acceptance criteria, dan artefact sign-off tertulis belum dilampirkan pada repository; status approval ini harus dilengkapi secara administratif sebelum release handoff.

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
| APK | `app-development-qa.apk` untuk null replay; `app-development-debug.apk` untuk latency loader retest |
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
| INT-ENV-007 | Migration/seed reproducibility | Fresh SQLite sementara menjalankan migrate:fresh, seluruh domain migration, DevDatabaseSeeder, UpdateCourseJapaneseTitlesSeeder, dan UpdateCourseItemJapaneseTitlesSeeder tanpa error | PASS |
| INT-MOB-001 | APK QA | `app:assembleDevelopmentQa` berhasil; APK ter-install ke emulator | PASS |
| INT-MOB-002 | Mobile launch/session | `MainActivity` resumed, proses hidup, log memuat student profile dan route `HomeScreen`, tanpa fatal exception | PASS-SMOKE |
| INT-MOB-003 | Student core routes | Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch pernah lulus smoke test emulator | PASS-SMOKE |
| INT-MOB-004 | Negative/lifecycle | Credential salah, logout, API unavailable, expired/invalid session, access boundary, permission denial, background/resume, dan rotation sudah diuji | PASS-SMOKE |
| INT-NEG-001 | Null/incomplete guard | Fixture null/incomplete direplay melalui proxy lokal; course menampilkan `0%`/`0 / 0`, Detail Training tetap usable, dan tidak ada fatal log | PASS-QA |
| INT-NEG-002 | Double-submit forum | Dua POST paralel sebelum fix menghasilkan dua record; setelah fix, dua tap cepat pada jalur draft dan publish masing-masing menghasilkan satu record dan fixture dibersihkan | PASS-QA |
| INT-NEG-003 | Slow network | Delayed proxy 2.5 detik menunjukkan loading overlay/spinner; data pulih ke `20%` dan `4 / 20`, tanpa `NaN` atau fatal log | PASS-QA |
| INT-CMS-001 | CMS/admin | Login admin dan flow CMS dasar sudah pernah diaudit; runtime CRUD lengkap tetap perlu retest dengan fixture internal | PASS-SMOKE |
| INT-REL-001 | Production AAB | Compile/native/R8 lulus; task berhenti pada release signing karena keystore dan `MYAPP_UPLOAD_*` belum tersedia | BLOCKED |

## 4. Internal Decision

Internal QA baseline: **CONDITIONAL PASS** dengan negative batch 2 sudah tertutup.

Artinya core flow dan environment lokal cukup untuk melanjutkan test cycle, tetapi belum boleh disebut siap publish. Dua gate besar masih terpisah:

1. Client UAT sudah dilaporkan approved, tetapi bukti sign-off dan detail acceptance criteria belum tersimpan di repo.
2. Google Play release masih blocked karena keystore upload, credential signing, production environment, dan Play Console belum lengkap.

## 5. Open Issues

| ID | Severity | Issue | Status |
| --- | --- | --- | --- |
| DEF-001 | P2 | Jest legacy membutuhkan mock native SDK yang belum lengkap | Blocked - test infrastructure |
| DEF-002 | P2 | Toast `Error internal server` transient saat startup/recovery; endpoint pemicu belum terisolasi | Open |
| QA-ENV-002 | P1 | Reproducibility migration/seed sudah dibuktikan pada fresh SQLite sementara | Closed - PASS |
| QA-NEG-004 | P1 | Fixture null/incomplete berhasil direplay ke emulator; UI menampilkan zero state yang valid tanpa `NaN` atau crash | Closed - PASS-QA |
| QA-NEG-005 | P2 | Delayed proxy 2.5 detik memperlihatkan loading overlay dan data pulih tanpa `NaN` atau crash | Closed - PASS-QA |
| QA-NEG-006 | P1 | Double tap forum terbukti membuat dua record sebelum fix; retest UI setelah guard menghasilkan satu record | Closed - PASS-QA (mobile guard) |
| REL-001 | P0 | Production keystore dan credential upload belum tersedia | Blocked |

## 6. Batasan Pengujian

- Data yang dipakai adalah seed/local data, bukan data bisnis resmi client.
- Login mobile pada sebagian smoke run memakai konfigurasi auto-login QA lokal.
- Belum ada validasi device fisik, push notification production, storage production, payment production, atau Play Console.
- Hasil internal tidak menggantikan sign-off dari client/product owner.
- Backend local `.env` sempat menunjuk ke absolute path database dari workspace lama; path lokal sudah diarahkan ke workspace aktif dan file `.env` tetap tidak di-commit.
- Detail negative test batch 2 tersedia di [NEGATIVE_TEST_BATCH_2_2026-08-01.md](NEGATIVE_TEST_BATCH_2_2026-08-01.md). Dua request forum paralel menghasilkan HTTP `201` dan dua record sebelum fix; cleanup fixture berhasil menyisakan nol record.
- Source mobile batch 2 menambah synchronous submit lock pada ForumEditor, `isLoading` pada tombol publish/draft, invalid JSON recovery, safe empty-array reducers pada DetailTrainingScreen, serta fallback cover course. TypeScript lulus, APK QA terbaru ter-install, MainActivity resumed, dan tidak ada fatal Android runtime log.
- Null/incomplete dan slow-network sudah direplay dengan proxy lokal. Null fixture menghasilkan zero state valid; delayed proxy 2.5 detik menghasilkan loading overlay lalu data normal. Double-tap UI juga lulus retest pada jalur draft dan publish di APK terbaru: masing-masing modal sukses tampil sekali dan database marker terhitung satu sebelum cleanup.

## 7. Next Internal Test Cycle

1. Lampirkan formal UAT sign-off dan acceptance criteria yang dilaporkan sudah approved.
2. Isolasi `DEF-002` toast `Error internal server` dan putuskan waiver/perbaikan `DEF-001` Jest.
3. Retest CMS CRUD content, user, role, permission, dan validation pada build berlabel release candidate.
4. Siapkan keystore/signing production, build AAB, dan jalankan release smoke test.
