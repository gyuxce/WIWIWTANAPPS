# QA/UAT Test Plan - WIWITAN Apps

Tanggal mulai: 1 Agustus 2026  
Stage: Stage 7 - Release Preparation setelah QA/UAT

## Tujuan

Dokumen ini menjadi checklist resmi untuk membuktikan bahwa aplikasi berjalan sesuai kebutuhan sebelum diserahkan ke client untuk UAT dan sebelum masuk persiapan rilis production.

QA dilakukan oleh tim teknis pada environment lokal/staging. UAT dilakukan oleh client atau product owner untuk menyatakan bahwa alur bisnis dan hasil aplikasi sudah diterima.

## Environment QA

| Komponen | Environment awal | Status |
| --- | --- | --- |
| Backend API | `http://127.0.0.1:8000` | Aktif untuk local QA |
| CMS | `http://127.0.0.1:3000` | Tersedia untuk local QA |
| Android AVD | `Wiwitan_API35_Lite`, Android API 35 | Terhubung |
| Android package QA | `com.wiwitanbaru.wiwitan.dev` | Terpasang |
| APK QA | `mobile/android/app/build/outputs/apk/development/qa/app-development-qa.apk` | Build lokal |
| Student seed | Akun siswa lokal pada README | Tersedia |
| Admin seed | Akun admin lokal pada README | Tersedia |

Catatan: hasil `PASS-SMOKE` pada dokumen ini adalah baseline teknis dari emulator lokal. Hasil tersebut belum menjadi persetujuan client dan belum mewakili production backend, storage, payment, Firebase, atau device fisik.

## Status Dan Severity

| Status | Arti |
| --- | --- |
| `PASS-SMOKE` | Lulus pada smoke test lokal, belum diuji sebagai UAT formal |
| `PASS-QA` | Lulus pada eksekusi QA dengan bukti yang dicatat |
| `PASS-UAT` | Diterima client/product owner |
| `PENDING` | Belum dieksekusi |
| `BLOCKED` | Tidak bisa dieksekusi karena dependency/environment |
| `PARTIAL` | Guard atau code-level evidence sudah diverifikasi, tetapi replay end-to-end belum lengkap |
| `FIXED-PENDING-RETEST` | Perbaikan sudah diterapkan dan dibuild, tetapi skenario UI final belum diulang |
| `FAIL` | Actual result tidak sesuai expected result |

| Severity | Arti |
| --- | --- |
| P0 | Aplikasi tidak bisa dipakai, data hilang, atau security blocker |
| P1 | Fitur core gagal dan tidak ada workaround yang layak |
| P2 | Fitur penting bermasalah tetapi masih ada workaround |
| P3 | Visual, copy, atau edge case minor |

## Entry Criteria

- Commit yang diuji sudah ditentukan dan repository bersih.
- Backend dan CMS environment QA dapat dijalankan.
- Database QA memiliki seed user admin dan student.
- APK QA dapat di-install pada emulator atau device.
- Logcat, screenshot, dan issue log dapat disimpan.
- Untuk UAT, client memiliki daftar kebutuhan bisnis dan akun uji yang disepakati.

## Exit Criteria

- Tidak ada defect P0 atau P1 yang terbuka.
- Semua test case P0/P1 mempunyai hasil `PASS-QA`.
- Semua alur UAT prioritas mempunyai hasil `PASS-UAT` atau exception tertulis dari client.
- Known issue, workaround, dan risiko sudah dicatat.
- Build candidate, backend version, database seed, dan environment sudah ditag.
- Privacy, signing, Firebase, storage, payment, dan Play Console checklist ditangani pada gate release terpisah.

## QA Automated And Environment Gates

| ID | Skenario | Expected result | Status | Bukti/catatan |
| --- | --- | --- | --- | --- |
| QA-ENV-001 | Backend health endpoint | API merespons HTTP 200 | PASS-QA | `GET /api/v1/constants/` merespons HTTP 200 |
| QA-ENV-002 | Backend migration/seed | Database QA dapat di-reset dan seed tanpa error | PASS-QA | Fresh SQLite sementara: migrate:fresh, seluruh domain migration, DevDatabaseSeeder, UpdateCourseJapaneseTitlesSeeder, dan UpdateCourseItemJapaneseTitlesSeeder lulus |
| QA-ENV-003 | CMS production build | `npm run build` selesai tanpa error fatal | PASS-QA | Build CMS selesai setelah `npm ci` |
| QA-ENV-004 | Mobile TypeScript | `corepack yarn tsc --noEmit --pretty false` lulus | PASS-QA | TypeScript lulus tanpa error |
| QA-ENV-005 | Mobile Jest baseline | Test runner selesai dan failure dicatat | PASS-QA | Jest harness test-only sudah mem-mock native dependency dan asset; `2` test suites / `4` tests passed, termasuk `App-test.tsx` |
| QA-ENV-006 | Android QA build/install | APK QA berhasil dibuild dan di-install | PASS-SMOKE | APK development QA sudah dipakai |
| QA-ENV-007 | Mojibake scan | Script tidak menemukan kandidat baru | PASS-QA | `No mojibake candidates found` |
| QA-ENV-008 | Secret/release hygiene | `.env`, keystore, dan credential tidak masuk Git | PASS-QA | Tidak ada file secret production yang tracked |
| QA-ENV-009 | Backend PHPUnit baseline | Test backend selesai tanpa failure | PASS-QA | 2 tests, 2 assertions passed |

## Authentication And Session

| ID | Skenario | Expected result | Severity | Status |
| --- | --- | --- | --- | --- |
| QA-AUTH-001 | Admin login valid | Admin masuk CMS dan dashboard terbuka | P1 | PASS-SMOKE |
| QA-AUTH-002 | Student login valid | Student masuk mobile dan profile termuat | P0 | PASS-SMOKE |
| QA-AUTH-003 | Credential salah | Pesan error jelas, tidak masuk Home, loading berhenti | P1 | PASS-QA |
| QA-AUTH-004 | Logout student | Token dibersihkan dan kembali ke login | P1 | PASS-QA |
| QA-AUTH-005 | Relaunch dengan session valid | App kembali ke layar siswa tanpa blank | P0 | PASS-QA |
| QA-AUTH-006 | Access token expired | Refresh token dicoba dan session tetap aktif | P0 | PASS-QA |
| QA-AUTH-007 | Refresh token invalid | Session dihapus dan user kembali login secara jelas | P1 | PASS-QA |
| QA-AUTH-008 | Role/access boundary | Student tidak dapat membuka route CMS/admin | P1 | PASS-QA |

## CMS Admin Flow

| ID | Skenario | Expected result | Severity | Status |
| --- | --- | --- | --- | --- |
| QA-CMS-001 | Dashboard admin | Dashboard, menu, dan data ringkasan terbuka | P1 | PASS-SMOKE |
| QA-CMS-002 | Daftar dan detail user | Search, sort, detail, dan status tampil benar | P1 | PASS-QA |
| QA-CMS-003 | Buat/edit user | Validasi field, format email, create/edit/delete, dan penyimpanan berhasil | P1 | PASS-QA |
| QA-CMS-004 | Daftar dan buat role | Permission dapat dipilih, dibaca kembali, dan dihapus | P1 | PASS-QA |
| QA-CMS-005 | Kategori training | Create/edit/delete dan title Jepang tersimpan | P1 | PASS-QA |
| QA-CMS-006 | Modul training | Module, item, dan title Jepang tersimpan; urutan belum diuji | P1 | PARTIAL |
| QA-CMS-007 | Virtual class | Create/edit/detail/delete, date picker, dan link tampil; upload/status edge case belum diuji | P1 | PASS-QA |
| QA-CMS-008 | Assessment | Package/question create-readback-edit-delete dan activation toggle lulus; verbal schedule/video publish belum lengkap | P1 | PARTIAL |
| QA-CMS-009 | Seminar | Daftar, create/edit/delete, date picker, link, dan detail terbuka | P2 | PASS-QA |
| QA-CMS-010 | Forum | Topic/list/detail, publish, delete, dan empty state stabil | P1 | PASS-QA |
| QA-CMS-011 | Notification content | Create/edit/delete, schedule, link, repeat, dan target user benar | P1 | PASS-QA |
| QA-CMS-012 | Pengaturan/profile | Profile dan system setting tidak merusak session | P2 | PASS-SMOKE |
| QA-CMS-013 | Form validation | Field wajib, email/url/date format, dan error API tampil jelas; duplicate belum diuji | P1 | PARTIAL |
| QA-CMS-014 | Permission matrix | Role non-admin tidak melihat atau mengakses menu terlarang | P0 | PENDING |

## Student Mobile Core Flow

| ID | Skenario | Expected result | Severity | Status |
| --- | --- | --- | --- | --- |
| QA-STU-001 | Home | Banner, course, forum/seminar section, dan navigation terbuka | P1 | PASS-SMOKE |
| QA-STU-002 | Progress | Fase, progress, dan detail interview tampil sesuai data | P1 | PASS-SMOKE |
| QA-STU-003 | Final interview detail | Detail/status terbuka tanpa crash | P1 | PASS-SMOKE |
| QA-STU-004 | Training category | Category dan progress dari backend tampil tanpa `NaN` | P0 | PASS-SMOKE |
| QA-STU-005 | Detail training/module | Header dan tab Modul dapat dibuka; title Jepang sesuai data | P1 | PASS-SMOKE |
| QA-STU-006 | Virtual class | Filter, search, detail, loading, dan empty state benar | P1 | PASS-SMOKE |
| QA-STU-007 | Assessment | Filter, detail, score, dan empty state benar | P1 | PASS-SMOKE |
| QA-STU-008 | Student documents | Search/filter, filename, preview/download, dan empty state benar | P1 | PASS-SMOKE |
| QA-STU-009 | Forum | Topic list, search/sort, detail, dan empty state benar | P1 | PASS-SMOKE |
| QA-STU-010 | Notifications | Tab, badge, list, detail, dan empty state benar | P1 | PASS-SMOKE |
| QA-STU-011 | Profile | Profile data, language, dan status tampil benar | P2 | PENDING |
| QA-STU-012 | Drawer navigation | Semua route yang tersedia dapat dibuka dan kembali | P1 | PASS-SMOKE |
| QA-STU-013 | Language mode | Label statis dan data bilingual tidak campur secara merusak | P2 | PENDING |
| QA-STU-014 | Device back/relaunch | Back navigation dan relaunch tidak membuat blank screen | P0 | PASS-SMOKE |

## Negative And Edge Case

| ID | Skenario | Expected result | Severity | Status |
| --- | --- | --- | --- | --- |
| QA-NEG-001 | API tidak tersedia | Error state jelas, tidak infinite loading atau crash | P0 | PASS-QA |
| QA-NEG-002 | Empty course/module | Tampil `0`, empty state, atau pesan yang benar; tidak `NaN` | P0 | PASS-SMOKE |
| QA-NEG-003 | Filename sangat panjang | Layout tidak overflow dan label tetap terbaca | P2 | PASS-SMOKE |
| QA-NEG-004 | Data backend null/incomplete | Guard UI aktif dan tidak crash saat fixture null/incomplete direplay | P1 | PASS-QA |
| QA-NEG-005 | Network lambat | Loading overlay terlihat selama delay 2.5 detik dan data pulih tanpa `NaN`/crash | P2 | PASS-QA |
| QA-NEG-006 | Double tap submit | Hanya satu request/data record yang dibuat | P1 | PASS-QA |
| QA-NEG-007 | Device rotation/background | State tidak hilang atau crash saat app kembali aktif | P2 | PASS-QA |
| QA-NEG-008 | Android permission denied | App memberi fallback/error yang dapat dipahami | P1 | PASS-QA |

## UAT Client Checklist

UAT dilakukan dengan akun dan data yang disetujui client. Setiap item harus memiliki screenshot atau rekaman singkat, actual result, nama tester, tanggal, dan keputusan `Accept` atau `Reject`.

Template eksekusi yang siap dikirim ke client tersedia di [UAT_CLIENT_EXECUTION_PACK.md](UAT_CLIENT_EXECUTION_PACK.md).

Hasil pengujian lokal/internal terbaru tersedia di [INTERNAL_UAT_REPORT_2026-08-01.md](INTERNAL_UAT_REPORT_2026-08-01.md). Per 1 Agustus 2026, project owner melaporkan bahwa client UAT sudah `Approved`. Bukti sign-off tertulis, nama reviewer, dan evidence per test case tetap perlu dilampirkan pada paket UAT agar status dapat diaudit.

Detail negative test batch 2 tersedia di [NEGATIVE_TEST_BATCH_2_2026-08-01.md](NEGATIVE_TEST_BATCH_2_2026-08-01.md).

| ID | Business flow | Acceptance criteria | Status |
| --- | --- | --- | --- |
| UAT-001 | Login siswa | Siswa dapat login dan melihat data miliknya | PENDING |
| UAT-002 | Melihat progress | Progress fase dan training sesuai data yang diberikan client | PENDING |
| UAT-003 | Mengikuti training | Siswa dapat membuka module, virtual class, dan assessment sesuai hak akses | PENDING |
| UAT-004 | Dokumen siswa | Siswa dapat melihat dan memakai dokumen yang di-upload | PENDING |
| UAT-005 | Forum | Siswa dapat melihat topic dan menjalankan alur posting/comment sesuai aturan | PENDING |
| UAT-006 | Notifikasi | Notifikasi yang relevan diterima dan dibaca oleh siswa | PENDING |
| UAT-007 | Admin mengelola konten | Admin dapat membuat, mengubah, dan menerbitkan konten training | PENDING |
| UAT-008 | Admin mengelola user/role | Admin dapat mengatur akses tanpa membuka menu yang salah | PENDING |
| UAT-009 | Bahasa aplikasi | Copy dan data bilingual yang disepakati client tampil benar | PENDING |
| UAT-010 | Persetujuan akhir | Client menyetujui known issue dan hasil UAT | PASS-UAT - approval reported; evidence pending |

## Defect Log

Gunakan satu baris per defect. Jangan menutup defect hanya karena workaround ditemukan; tulis workaround pada kolom catatan.

| ID | Test case | Severity | Actual result | Evidence | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | QA-ENV-005 | P2 | Existing `App-test.tsx` membutuhkan konfigurasi mock native SDK yang luas dan sebelumnya berhenti sebelum assertion | Jest output, `mobile/jest.setup.js`, `mobile/__mocks__/assetMock.js` | Engineering | Closed - PASS-QA (Jest harness) |
| DEF-002 | QA-AUTH-006 | P2 | Toast `Error internal server` muncul transient saat HTTP `401` terjadi ketika access-token recovery berjalan | `ApiResponse-test`, APK replay expired access token, logcat tanpa internal-server error/fatal | Engineering | Closed - PASS-QA (401 recovery) |
| DEF-003 | QA-NEG-006 | P1 | Dua request forum paralel sebelum fix sama-sama `201 Created`; setelah guard UI, dua tap cepat menghasilkan satu record | API reproduction, emulator UI retest, database count `1`, fixture cleanup | Engineering | Closed - PASS-QA (mobile guard) |
| CMS-DEF-001 | QA-CMS-003 | P2 | CMS logout dapat meninggalkan session lokal ketika revoke refresh token gagal | `cms/src/utils/hooks/useAuth.js`, browser retest | Engineering | Closed - PASS-QA |
| CMS-DEF-002 | QA-CMS-006 | P1 | Local database tidak memiliki `course_items.title_japan` sampai migration domain dijalankan | Migration `Training/2026_07_22_000001...`, local migration run | Engineering | Open - staging/production migration verification |
| CMS-DEF-003 | QA-CMS-005/006 | P2 | Seed title Jepang menampilkan mojibake | `UpdateCourseItemJapaneseTitlesSeeder.php`, module list readback | Engineering | Closed - PASS-QA |
| CMS-DEF-004 | QA-CMS-006 | P3 | Toast edit materi masih berbunyi `Berhasil membuat data` | CMS training material edit retest | Engineering | Open - copy only |
| CMS-DEF-005 | QA-CMS-009 | P3 | Date kosong pada Seminar menampilkan error Yup teknis | `cms/src/views/seminar/form.js`, empty-submit retest | Engineering | Closed - PASS-QA |
| CMS-DEF-006 | QA-CMS-011 | P1 | Field link notifikasi hilang saat readback karena tidak ada di request validation backend | `ApiContentNotificationRequest.php`, edit readback retest | Engineering | Closed - PASS-QA |
| CMS-DEF-007 | QA-CMS-007 | P2 | Virtual class create berhasil tetapi halaman tetap di form karena `PageConfig.url` kosong | `cms/src/views/training/module/detail/virtual/create.js`, browser retest | Engineering | Closed - PASS-QA |
| CMS-DEF-008 | QA-CMS-006 | P1 | Delete modul melakukan soft-delete pada parent tetapi child asesmen otomatis masih aktif; fixture QA perlu dibersihkan di level database | CMS module delete retest, local SQLite relation count | Engineering/Product | Open - retention policy and backend cascade/archive required |

## Execution Notes

- Smoke baseline 1 Agustus 2026 lulus untuk Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch/session recovery.
- QA environment batch 1: API health, backend PHPUnit, CMS build, mobile TypeScript, mojibake scan, dan secret hygiene lulus.
- Migration/seed reproducibility: fresh SQLite sementara berhasil menjalankan migrate:fresh, migration Base/Master/Finance/Forum/Training/TableRefs, DevDatabaseSeeder, UpdateCourseJapaneseTitlesSeeder, dan UpdateCourseItemJapaneseTitlesSeeder tanpa error.
- Negative test batch 2 dicatat di [NEGATIVE_TEST_BATCH_2_2026-08-01.md](NEGATIVE_TEST_BATCH_2_2026-08-01.md). Double-submit forum berhasil direproduksi sebelum fix: dua request paralel membuat dua record, lalu fixture dibersihkan sampai tersisa nol.
- Null/incomplete hardening sudah ditambahkan pada progress card, SectionLesson, dan DetailTrainingScreen. Fixture null/incomplete direplay melalui `scripts/qa-http-proxy.mjs` ke emulator; course menampilkan `0%`/`0 / 0`, Detail Training tetap usable, dan tidak ada fatal Android runtime log. `QA-NEG-004` ditutup `PASS-QA`.
- Guard double-submit ForumEditor sudah memakai synchronous ref lock, state loading tombol, serta recovery pada invalid JSON dan request rejection. Retest UI pada APK terbaru lulus untuk tombol draft dan publish: masing-masing dua tap cepat menampilkan loading state, satu modal sukses, dan satu matching database record; seluruh fixture kemudian dibersihkan.
- Latency test memakai delayed proxy `scripts/qa-http-proxy.mjs` pada delay 2.5 detik. Detail Training menampilkan loading overlay/spinner, kemudian pulih ke data `20%` dan `4 / 20` tanpa `NaN` atau crash. `QA-NEG-005` ditutup `PASS-QA`.
- Backend local `.env` sempat menunjuk ke absolute path database dari workspace lama; path lokal sudah diarahkan ke workspace aktif dan tidak di-commit.
- Auth API contract batch: credential valid merespons HTTP 200, credential invalid merespons HTTP 422, dan access token invalid merespons HTTP 401. UI login juga sudah diverifikasi menampilkan error dan tidak masuk Home.
- Negative mobile QA batch pada AVD `Wiwitan_API35_Lite`: credential salah menampilkan `Login gagal` dan tetap di layar login; logout mengembalikan user ke landing; API mati menampilkan `Network request failed` tanpa crash; backend kembali normal setelah test.
- Expired-session test: access token lokal dibuat benar-benar kedaluwarsa dengan signature valid dan refresh token tetap valid; aplikasi berhasil menyimpan access token baru dan kembali ke layar Progress. Invalid access token + invalid refresh token menghapus auth/user dari storage dan mengembalikan aplikasi ke landing dengan tombol `Masuk`.
- Access boundary test: token student mendapatkan HTTP 401 pada `GET /api/v1/base/users`, sedangkan `GET /api/v1/auth/user/me` tetap HTTP 200. Ini membuktikan route CMS/admin tidak terbuka untuk student pada local API.
- Device lifecycle test: background/resume dan rotasi layar kembali menampilkan UI Progress tanpa `FATAL EXCEPTION`, crash, atau kehilangan session. Permission Kalender ditolak dan aplikasi tetap dapat digunakan.
- `QA-NEG-004` sekarang `PASS-QA`: fixture response null/incomplete berhasil direplay ke emulator dengan proxy lokal dan tidak menghasilkan `NaN`, blank, atau crash.
- `QA-NEG-005` sekarang `PASS-QA`: delayed proxy 2.5 detik memperlihatkan loading overlay dan data pulih setelah request selesai.
- `QA-NEG-006` sekarang `PASS-QA`: dua tap cepat pada Forum Editor menghasilkan satu record pada emulator; marker QA dihapus setelah verifikasi. Direct API parallel replay sebelum fix tetap dicatat sebagai rekomendasi backend idempotency.
- DEF-002 sudah diisolasi pada mapping response di `mobile/src/hooks/useExam.ts`: HTTP `401` dari request training ketika access-token recovery berlangsung sebelumnya dipetakan menjadi error `500`. Setelah guard diterapkan, regression test lulus dan expired-access replay pada APK baru menghasilkan access token baru tanpa `Error internal server` atau `FATAL EXCEPTION`.
- CMS build membutuhkan `npm ci` ketika dependency lokal belum lengkap; `cms/yarn.lock` dikembalikan dan tidak menjadi bagian dari perubahan.
- CMS functional QA 1 Agustus 2026: user/role, training category/module/material, forum, seminar, dan notification core flows lulus pada local development. Temporary QA records were removed after each flow.
- Notification link persistence was reproduced as a backend validation defect, fixed by adding the optional URL rule, then verified through CMS edit readback and database-backed API response.
- Seminar empty date validation was reproduced before the fix and now returns the user-facing required-field message.
- Virtual Class CRUD was executed from the module detail tab. The create redirect defect was fixed and the temporary class was read back, edited, and deleted.
- Assessment package/question flow was executed with a temporary package and question. Activation was toggled off and restored on the seeded assessment; verbal schedule and video upload remain separate gaps.
- CMS module deletion retest found that the parent is soft-deleted while generated assessment child rows remain active. The local QA fixture sweep removed all temporary descendants and returned zero active or soft-deleted `QA CMS` rows, but production cascade/archive behavior remains an open defect.
- Mobile Jest sudah menjadi gate code-level terbatas untuk regression test yang tersedia. `App-test.tsx` dan helper DEF-002 lulus dengan `2` suites / `4` tests; mock native dependency berada di `mobile/jest.setup.js` dan hanya aktif pada Jest.
- `PASS-SMOKE` harus diulang sebagai `PASS-QA` setelah test data, build, dan bukti eksekusi formal ditetapkan.
- UAT client dilaporkan sudah `Approved` oleh project owner pada 1 Agustus 2026. Template formal sign-off tersedia di [UAT_SIGN_OFF_2026-08-01.md](UAT_SIGN_OFF_2026-08-01.md), tetapi acceptance criteria, nama reviewer, evidence, dan konfirmasi tertulis tetap harus diisi agar approval menjadi auditable.
- Defect P0/P1 harus ditutup atau mendapat waiver tertulis sebelum gate release.

## Next Gate

1. Lengkapi dan minta konfirmasi pada [UAT_SIGN_OFF_2026-08-01.md](UAT_SIGN_OFF_2026-08-01.md), termasuk scope, evidence, known issue, nama reviewer, dan tanda tangan/approval tertulis.
2. Close `CMS-DEF-008` after the module deletion retention/cascade policy is implemented and verified with database evidence.
3. Finish CMS virtual class, assessment, upload/storage, and restricted-role permission tests.
4. Retest CMS CRUD content, user, role, permission, and validation on a labeled release candidate.
5. Siapkan release candidate berlabel version dan kumpulkan screenshot/log evidence final.
6. Selesaikan `REL-001`: keystore/signing production, AAB production, dan checksum.
7. Lanjutkan production config, privacy/Data Safety, Firebase/storage/payment, Play Console internal testing, dan release smoke test.
