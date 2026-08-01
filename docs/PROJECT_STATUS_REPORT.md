# Project Status Report - WIWITAN Apps

Tanggal update: 1 Agustus 2026

## Ringkasan Eksekutif

Project saat ini berada di fase **release preparation setelah internal QA dan approval UAT client**, bukan fase release production.

Source handoff dari developer sebelumnya sudah dirapikan ke repo, environment lokal sudah bisa dijalankan, CMS dan backend lokal sudah aktif, APK Android development sudah berhasil dibuild dan diinstall ke emulator, dan flow utama siswa sudah mulai stabil.

Estimasi kesiapan keseluruhan saat ini: **70-75% menuju release candidate internal**.

Estimasi kesiapan menuju **rilis Google Play production**: **45-50%**, karena masih ada pekerjaan release engineering, konfigurasi production, signing, privacy/compliance, dan validasi backend production.

## Checkpoint Terbaru - 1 Agustus 2026

- Posisi aktual: release preparation setelah stabilisasi mobile Android, penutupan negative test batch 2, dan approval UAT client yang dilaporkan project owner.
- Login API siswa tervalidasi dengan HTTP 200 dari backend lokal.
- Handling login mobile diperbaiki agar respons/error API terbaca jelas dan aplikasi tidak pindah ke Home sebelum profil berhasil dimuat.
- TypeScript mobile lulus dan APK `developmentQa` terbaru berhasil dibuild. APK ini masih ditandatangani debug untuk audit lokal, bukan untuk Google Play.
- APK QA terbaru berhasil di-install ke emulator. Log menunjukkan `[QA auto-login] signed in` dan UI siswa terbuka pada layar progress dengan data fase/interview.
- Smoke test end-to-end lokal siswa lulus untuk Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch/session recovery.
- Formal QA batch 1 selesai: API health HTTP 200, backend PHPUnit 2 tests passed, CMS production build, mobile TypeScript, mojibake scan, dan secret hygiene lulus.
- Negative mobile QA batch 1 selesai: credential salah, logout, API tidak tersedia, expired/invalid session, access boundary student/admin, permission denial, background/resume, dan rotasi device sudah diuji pada emulator.
- Mobile Jest harness sudah diperbaiki untuk dependency native yang dibutuhkan test; `2` test suites / `4` tests passed dan TypeScript tetap lulus.
- Login otomatis dari `.env` hanya untuk QA lokal; credential contoh tidak lagi ditanam sebagai fallback di source.
- Build type `qa` sekarang mengizinkan HTTP cleartext hanya melalui manifest `mobile/android/app/src/qa/AndroidManifest.xml`, karena backend emulator lokal memakai `10.0.2.2`; production tetap tidak diberi izin HTTP cleartext.
- Build lokal saat ini memakai Node 24 karena dependency Metro yang terpasang (`metro-config` 0.83.x) mensyaratkan Node 20.19.4 atau lebih baru. Penyelarasan dependency dengan baseline Node 18 dicatat sebagai hardening build terpisah.
- Preflight `bundleProductionRelease` sudah dijalankan; R8/minification berhasil setelah heap Gradle dinaikkan menjadi 3 GB.
- Local release-candidate hardening sudah lulus: `developmentQa` dibuild dengan env QA eksplisit, checksum dicatat, APK di-install ke emulator, dan MainActivity resumed tanpa fatal log. Detail ada di `docs/LOCAL_RELEASE_CANDIDATE_2026-08-01.md`.
- Production package script sekarang menolak build sebelum Gradle jika `.env.production` belum tersedia; ini mencegah URL emulator dan auto-login QA masuk ke production bundle.
- Production signing belum tersedia: keystore upload dan credential `MYAPP_UPLOAD_*` belum diset, sehingga AAB belum terbentuk.
- Guard signing sudah ditambahkan agar build production gagal dengan pesan yang jelas, bukan `NullPointerException`.
- Local release-candidate hardening menambahkan pemilihan `ENVFILE` eksplisit dan validasi agar URL emulator/auto-login QA tidak dapat ikut ke production bundle.
- Paket eksekusi UAT client sudah siap, approval client sudah dilaporkan, dan template formal sign-off sudah ditambahkan di `docs/UAT_SIGN_OFF_2026-08-01.md`; nama reviewer, acceptance criteria, dan evidence formal masih perlu dilampirkan.
- Internal UAT baseline sudah dijalankan dengan hasil `CONDITIONAL PASS`; detail evidence dipisahkan dari approval client.
- Negative test batch 2 sudah dijalankan: duplicate submit forum berhasil direproduksi sebelum fix, guard mobile sudah diterapkan dan lulus retest UI, null-safety training diperkuat, serta null payload dan slow-network sudah lulus replay. Detail ada di `docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md`.
- `QA-NEG-004` null/incomplete sudah direplay melalui proxy fixture ke emulator. Course dan Detail Training menampilkan zero state valid tanpa `NaN`, blank, atau crash.
- `QA-NEG-005` latency sudah diuji dengan delayed proxy 2.5 detik. Detail Training menampilkan loading overlay/spinner, lalu pulih ke data normal tanpa `NaN` atau crash.
- Client UAT dilaporkan sudah approved oleh project owner pada 1 Agustus 2026. DEF-001 dan DEF-002 sudah ditutup berdasarkan evidence QA; formal sign-off, acceptance criteria, dan evidence per flow masih perlu dilampirkan.
- DEF-002 sudah diretest pada APK baru dengan expired access token dan refresh token aktif. Access token baru tersimpan, tanpa `Error internal server` dan tanpa `FATAL EXCEPTION`.
- Fresh SQLite migration dan seed seluruh domain sudah lulus; path DB lokal lama ditemukan dan dikoreksi tanpa memasukkan `.env` ke repo.
- Residual local QA batch selesai untuk scope yang dapat diuji lokal: Assessment verbal schedule/readback/filter, Profile mode Indonesia/Jepang, module pagination/filter boundary, dan student action-level admin boundary. Sesi seed Assessment dan fase siswa sudah dipulihkan setelah test.
- `CMS-DEF-014` ditutup: filter daftar Assessment lisan sekarang mempertahankan sesi dengan `status = null`, sehingga jadwal yang belum selesai tidak hilang dari CMS.
- Release hygiene tambahan: Redux logger dan diagnostic FCM/index sekarang hanya aktif pada development/QA, sehingga token dan payload notifikasi tidak ditulis ke Logcat production. Production-shaped env validator lulus; production debug compile lokal masih timeout tanpa database klien dan dicatat sebagai follow-up build-time.

## Stage Saat Ini

Stage sekarang: **Stage 7 - Release Preparation setelah QA/UAT**

Mapping stage:

| Stage | Nama Stage | Status |
| --- | --- | --- |
| 1 | Repo recovery & cleanup dari source handoff | Selesai |
| 2 | Local backend/CMS/mobile setup | Selesai untuk local dev |
| 3 | Audit CMS dan flow admin dasar | Sebagian besar selesai |
| 4 | Audit dan stabilisasi mobile siswa | Core flow dan recovery utama selesai; edge case sudah masuk QA |
| 5 | Data/i18n/backend schema hardening | Sebagian selesai; course bilingual sudah ada, forum/notifikasi dinamis masih pending |
| 6 | QA end-to-end dan UAT client | QA batch 1-2 serta DEF-001/DEF-002 sudah ditutup untuk scope yang diuji; client UAT dilaporkan approved, evidence formal masih perlu dilampirkan |
| 7 | Release preparation Google Play | Aktif; signing/AAB, production config, compliance, dan Play Console masih pending |

## Progress Per Area

| Area | Estimasi Progress | Status |
| --- | ---: | --- |
| Repo, struktur, dokumentasi awal | 90% | Repo sudah rapi, README/docs aktif diperbarui |
| Backend local development | 75% | Laravel local jalan, SQLite dan local auth fallback sudah bisa dipakai |
| CMS local/admin | 75% | Core CMS, archive lifecycle, local storage, assessment schedule, dan permission boundary sudah diaudit; production dependencies masih terbuka |
| Mobile Android build | 80% | APK `developmentQa` berhasil build/install dengan env eksplisit; production signing/AAB masih blocked |
| Mobile siswa core flow | 75% | Login, session recovery, progress, training, dokumen, forum, notifikasi, Profile, dan dua mode bahasa sudah diaudit |
| Training module/progress logic | 80% | Bug NaN, mismatch progress, detail training sudah diperbaiki |
| Media/document handling | 70% | Local Sardine upload/readback untuk cover, video, dan dokumen sudah lulus; production media masih perlu validasi |
| i18n/mixed language | 50% | Mode fase Indonesia/Jepang serta course category/item/module sudah diverifikasi; forum topic dan notification data masih perlu schema/backend/CMS |
| QA/UAT formal | 75% | Residual local QA dan DEF-001/DEF-002 sudah PASS-QA untuk scope yang diuji; formal sign-off, production retest, dan evidence client masih perlu dilengkapi |
| Google Play release readiness | 30% | Local preflight dan env guard sudah lebih rapi; signing/AAB, Play Console, privacy policy, production env, dan store assets belum selesai |

## Yang Sudah Diselesaikan

- Source handoff sudah masuk repo GitHub private dan struktur folder sudah terdokumentasi.
- README dan docs setup sudah dibuat/dirapikan.
- Backend Laravel bisa jalan lokal dengan SQLite.
- CMS bisa login admin lokal.
- Mobile Android bisa dibuild menjadi APK development.
- Android SDK/JDK/NDK setup sudah dilewati.
- Login siswa lokal berhasil dengan seed `user1@62teknologi.com`.
- Session recovery mobile sudah diperbaiki agar token access expired bisa refresh token.
- Blank screen/logout setelah relaunch sudah ditangani.
- Training progress `NaN%`, `NaN / NaN`, dan mismatch `5 / 20` sudah diperbaiki.
- Detail Training, tab Modul, Virtual Class, dan Asesmen sudah lebih stabil.
- Dokumen siswa sudah lebih rapi: label file fungsional dan filename panjang dipendekkan.
- Mojibake/encoding sudah diaudit dan ada script checker.
- i18n awal sudah dirapikan untuk teks statis mobile.
- Course category sudah memakai `title_japan` dari backend, dan seed lokal sudah diisi title Jepang.
- Course item/module mulai mendukung `title_japan` dari backend, CMS, seed lokal, dan mobile display.
- Release signing Android mulai dirapikan agar credential production tidak disimpan di repo.
- Checklist rilis Google Play sudah dibuat sebagai acuan menuju AAB production.
- UAT client execution pack sudah dibuat dengan matrix login, progress, training, dokumen, forum, notifikasi, CMS, role, bilingual, dan sign-off.
- Internal UAT report 1 Agustus 2026 sudah mencatat gate backend, CMS build, mobile TypeScript, APK launch, security hygiene, dan open issue.
- QA-ENV-002 migration/seed reproducibility sudah ditutup sebagai `PASS-QA` pada fresh SQLite sementara.
- Preflight production sudah melewati R8; blocker rilis sekarang terisolasi pada keystore upload dan credential signing yang belum tersedia.
- Guard signing production sudah ditambahkan agar error konfigurasi terbaca jelas dan tidak membingungkan saat build.
- Hasil audit dicatat di `docs/MOBILE_SCREEN_AUDIT.md`.
- Negative test mobile batch 1 sudah dicatat di `docs/QA_UAT_TEST_PLAN.md`, termasuk evidence API status, UI state, storage session, logcat, dan lifecycle emulator.
- Negative test batch 2 sudah dicatat di `docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md`: double-submit forum terbukti membuat dua record sebelum fix, guard mobile sudah diterapkan, retest dua tap UI menghasilkan satu record, dan null/incomplete guard sudah diperkuat.
- QA-NEG-004 null/incomplete sudah direplay dengan proxy fixture dan ditutup `PASS-QA`.
- QA-NEG-005 slow network sudah diuji dengan delayed proxy 2.5 detik; loading overlay ditambahkan pada Detail Training dan ditutup `PASS-QA`.
- Client UAT dilaporkan approved oleh project owner; artefact sign-off dan evidence formal masih menjadi release-handoff item.
- Mobile Jest baseline sudah lulus setelah test-only native mocks ditambahkan: `2` suites / `4` tests passed; ini menutup DEF-001 pada level code/test, bukan menggantikan device QA.
- DEF-002 sudah ditutup setelah HTTP `401` recovery diretest pada APK baru dan access token baru tersimpan tanpa internal-server error/fatal.

## Temuan/Risiko Utama

| Risiko | Dampak | Status |
| --- | --- | --- |
| Data production belum divalidasi penuh | Bisa beda dengan seed lokal | Perlu akses/staging production-like |
| i18n data dinamis belum full bilingual | Teks course item, forum topic, notification masih bisa campur bahasa | Perlu desain schema/backend/CMS |
| Media GCS/file production belum tervalidasi | Preview gambar/video/audio bisa gagal jika permission/storage salah | Perlu audit storage production |
| QA formal belum lengkap | Bug timeout, retry, dan edge case yang belum masuk scope bisa masih tersembunyi | Perlu final evidence, timeout/retry test pada staging, dan client sign-off |
| Client evidence belum lengkap | Approval yang dilaporkan belum dapat diaudit sebagai dokumen formal | Perlu nama reviewer, acceptance criteria, evidence, dan konfirmasi tertulis |
| Release Google Play belum siap | Belum bisa publish production | Perlu keystore upload, `MYAPP_UPLOAD_*`, Play Console, privacy, dan AAB |
| Push notification/Firebase belum diaudit production | Notifikasi real device bisa belum siap | Perlu credential dan test device |
| Payment/transaction production belum diaudit penuh | Flow pembayaran bisa bergantung vendor/config | Perlu env/vendor production atau staging |

## Estimasi Rilis

Estimasi bergantung pada definisi "rilis".

### Rilis Internal APK untuk Review Client

Target realistis: **3-5 hari kerja**

Syarat:
- APK debug/staging terbaru dibuild.
- Flow siswa utama dites ulang.
- Backend/CMS lokal atau staging stabil.
- Known issue dicatat jelas.

### Release Candidate Staging

Target realistis: **1-2 minggu**

Syarat:
- Environment staging production-like siap.
- Data seed/staging rapi.
- QA checklist untuk siswa/admin selesai.
- Media storage dan notification dicek.
- Bug prioritas tinggi ditutup.

### Rilis Google Play Production

Target realistis: **3-5 minggu**, jika akses dan kebutuhan production tersedia cepat.

Syarat:
- Keystore/signing key tersedia atau dibuat.
- App ID/package/fingerprint final.
- Firebase production config final.
- API production/staging sudah stabil.
- Privacy policy, data safety form, app icon/screenshot/store listing siap.
- Build AAB production berhasil.
- UAT client approve.
- Review Google Play lolos.

## Mapping Pekerjaan Berikutnya

Prioritas terdekat:

1. **Lengkapi handoff QA/UAT**
   - Isi dan minta approval pada `docs/UAT_SIGN_OFF_2026-08-01.md`.
   - Lampirkan acceptance criteria, evidence per flow, nama reviewer, dan keputusan known issue.
   - Retest CMS CRUD content, user, role, permission, dan validation pada build release candidate.

2. **Audit production/staging readiness**
   - Env backend.
   - Firebase config.
   - Storage/media.
   - Payment/vendor.

3. **Lengkapi release signing dan build AAB**
   - Minta keystore upload resmi dari owner atau buat sekali dengan persetujuan owner.
   - Simpan keystore dan password di luar repo.
   - Set `MYAPP_UPLOAD_*` pada mesin build.
   - Jalankan ulang `bundleProductionRelease` dan simpan checksum AAB.

4. **Siapkan release track**
   - Debug APK untuk internal review.
   - Staging/release APK atau AAB.
   - Google Play checklist.

## Status yang Bisa Disampaikan ke Klien

Versi singkat:

> Project sudah melewati stabilisasi aplikasi mobile siswa dan negative QA batch 2. Null/incomplete payload serta latency 2.5 detik sudah lulus pada emulator, dan client UAT dilaporkan approved. Kesiapan menuju internal release candidate sekitar 65-70%. Untuk rilis Google Play production masih perlu validasi environment production, signing/AAB, Firebase/storage/payment, privacy/compliance, Play Console, dan store listing.

Versi timeline:

> Estimasi APK internal untuk review bisa disiapkan dalam 3-5 hari kerja setelah scope review disepakati. Release candidate staging realistis 1-2 minggu. Rilis Google Play production realistis 3-5 minggu, tergantung kesiapan akses production, Play Console, Firebase, storage, payment, privacy policy, dan hasil UAT.
