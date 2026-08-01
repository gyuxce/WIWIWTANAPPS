# QA/UAT Test Plan - WIWITAN Apps

Tanggal mulai: 1 Agustus 2026  
Stage: Stage 6 - Formal QA dan UAT

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
| QA-ENV-002 | Backend migration/seed | Database QA dapat di-reset dan seed tanpa error | PENDING | Catat command dan database |
| QA-ENV-003 | CMS production build | `npm run build` selesai tanpa error fatal | PASS-QA | Build CMS selesai setelah `npm ci` |
| QA-ENV-004 | Mobile TypeScript | `corepack yarn tsc --noEmit --pretty false` lulus | PASS-QA | TypeScript lulus tanpa error |
| QA-ENV-005 | Mobile Jest baseline | Test runner selesai dan failure dicatat | BLOCKED | `App-test.tsx` membutuhkan mock banyak native SDK; test harness legacy |
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
| QA-CMS-002 | Daftar dan detail user | Search, sort, detail, dan status tampil benar | P1 | PASS-SMOKE |
| QA-CMS-003 | Buat/edit user | Validasi field dan penyimpanan berhasil | P1 | PENDING |
| QA-CMS-004 | Daftar dan buat role | Permission dapat dipilih dan disimpan | P1 | PASS-SMOKE |
| QA-CMS-005 | Kategori training | Create/edit/status dan title Jepang tersimpan | P1 | PASS-SMOKE |
| QA-CMS-006 | Modul training | Module, item, urutan, dan title Jepang tersimpan | P1 | PASS-SMOKE |
| QA-CMS-007 | Virtual class | Create/edit/detail dan status tampil | P1 | PENDING |
| QA-CMS-008 | Assessment | Template, question, dan publish flow berjalan | P1 | PENDING |
| QA-CMS-009 | Seminar | Daftar, create/edit, dan detail terbuka | P2 | PASS-SMOKE |
| QA-CMS-010 | Forum | Category/topic/list/detail dan empty state stabil | P1 | PASS-SMOKE |
| QA-CMS-011 | Notification content | Create/edit/publish dan target user benar | P1 | PENDING |
| QA-CMS-012 | Pengaturan/profile | Profile dan system setting tidak merusak session | P2 | PASS-SMOKE |
| QA-CMS-013 | Form validation | Field wajib, format, duplicate, dan error API tampil jelas | P1 | PENDING |
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
| QA-NEG-004 | Data backend null/incomplete | Guard UI aktif dan tidak crash | P1 | PENDING |
| QA-NEG-005 | Network lambat | Loading state terlihat dan request tidak menduplikasi data secara salah | P2 | PENDING |
| QA-NEG-006 | Double tap submit | Hanya satu request/data record yang dibuat | P1 | PENDING |
| QA-NEG-007 | Device rotation/background | State tidak hilang atau crash saat app kembali aktif | P2 | PASS-QA |
| QA-NEG-008 | Android permission denied | App memberi fallback/error yang dapat dipahami | P1 | PASS-QA |

## UAT Client Checklist

UAT dilakukan dengan akun dan data yang disetujui client. Setiap item harus memiliki screenshot atau rekaman singkat, actual result, nama tester, tanggal, dan keputusan `Accept` atau `Reject`.

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
| UAT-010 | Persetujuan akhir | Client menyetujui known issue dan hasil UAT | PENDING |

## Defect Log

Gunakan satu baris per defect. Jangan menutup defect hanya karena workaround ditemukan; tulis workaround pada kolom catatan.

| ID | Test case | Severity | Actual result | Evidence | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | QA-ENV-005 | P2 | Existing `App-test.tsx` belum dapat berjalan karena membutuhkan konfigurasi mock native SDK yang luas | Jest output | Engineering | Blocked - test infra |
| DEF-002 | QA-AUTH-006 | P2 | Toast `Error internal server` muncul transient saat startup/recovery walaupun session akhirnya pulih dan Progress termuat; endpoint pemicu belum diketahui | Logcat `ReactNativeJS` dan UI Progress | Engineering | Open - isolate endpoint |

## Execution Notes

- Smoke baseline 1 Agustus 2026 lulus untuk Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch/session recovery.
- QA environment batch 1: API health, backend PHPUnit, CMS build, mobile TypeScript, mojibake scan, dan secret hygiene lulus.
- Auth API contract batch: credential valid merespons HTTP 200, credential invalid merespons HTTP 422, dan access token invalid merespons HTTP 401. UI login juga sudah diverifikasi menampilkan error dan tidak masuk Home.
- Negative mobile QA batch pada AVD `Wiwitan_API35_Lite`: credential salah menampilkan `Login gagal` dan tetap di layar login; logout mengembalikan user ke landing; API mati menampilkan `Network request failed` tanpa crash; backend kembali normal setelah test.
- Expired-session test: access token lokal dibuat benar-benar kedaluwarsa dengan signature valid dan refresh token tetap valid; aplikasi berhasil menyimpan access token baru dan kembali ke layar Progress. Invalid access token + invalid refresh token menghapus auth/user dari storage dan mengembalikan aplikasi ke landing dengan tombol `Masuk`.
- Access boundary test: token student mendapatkan HTTP 401 pada `GET /api/v1/base/users`, sedangkan `GET /api/v1/auth/user/me` tetap HTTP 200. Ini membuktikan route CMS/admin tidak terbuka untuk student pada local API.
- Device lifecycle test: background/resume dan rotasi layar kembali menampilkan UI Progress tanpa `FATAL EXCEPTION`, crash, atau kehilangan session. Permission Kalender ditolak dan aplikasi tetap dapat digunakan.
- `QA-NEG-004`, `QA-NEG-005`, dan `QA-NEG-006` masih `PENDING` karena membutuhkan fixture null/incomplete, network shaping terkontrol, dan skenario submit yang tidak mengubah data bisnis secara tidak sengaja.
- Selama startup/recovery muncul toast generik `Error internal server` beberapa kali, tetapi layar Progress akhirnya termuat dan session tetap aktif. Endpoint pemicu belum terisolasi; dicatat sebagai `DEF-002` P2 untuk investigasi sebelum production.
- CMS build membutuhkan `npm ci` ketika dependency lokal belum lengkap; `cms/yarn.lock` dikembalikan dan tidak menjadi bagian dari perubahan.
- Mobile Jest belum menjadi gate QA karena test lama mengimpor native SDK secara penuh dan berhenti sebelum assertion; ini dicatat sebagai blocker test infrastructure terpisah dari runtime APK.
- `PASS-SMOKE` harus diulang sebagai `PASS-QA` setelah test data, build, dan bukti eksekusi formal ditetapkan.
- UAT belum dimulai sampai client menyediakan acceptance criteria, akun/data uji, dan reviewer yang ditunjuk.
- Defect P0/P1 harus ditutup atau mendapat waiver tertulis sebelum gate release.

## Next Gate

1. Tutup `QA-ENV-002` dan putuskan perbaikan untuk blocker `QA-ENV-005`.
2. Selesaikan negative case yang masih pending: null/incomplete data, network lambat, dan double tap submit.
3. Siapkan build QA yang diberi version label dan kumpulkan screenshot/log evidence per layar.
4. Kirim UAT checklist ke client/product owner untuk eksekusi dengan data bisnis.
5. Setelah UAT diterima, lanjut ke release hardening dan Google Play internal testing.
