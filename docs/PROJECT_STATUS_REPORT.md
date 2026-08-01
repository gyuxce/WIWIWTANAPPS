# Project Status Report - WIWITAN Apps

Tanggal update: 1 Agustus 2026

## Ringkasan Eksekutif

Project saat ini berada di fase **formal QA/UAT dan release preparation awal**, bukan fase release production.

Source handoff dari developer sebelumnya sudah dirapikan ke repo, environment lokal sudah bisa dijalankan, CMS dan backend lokal sudah aktif, APK Android development sudah berhasil dibuild dan diinstall ke emulator, dan flow utama siswa sudah mulai stabil.

Estimasi kesiapan keseluruhan saat ini: **60-65% menuju release candidate internal**.

Estimasi kesiapan menuju **rilis Google Play production**: **45-50%**, karena masih ada pekerjaan release engineering, QA/UAT, konfigurasi production, signing, privacy/compliance, dan validasi backend production.

## Checkpoint Terbaru - 1 Agustus 2026

- Posisi aktual: QA/UAT formal tahap awal, setelah stabilisasi mobile Android dan negative test batch 1.
- Login API siswa tervalidasi dengan HTTP 200 dari backend lokal.
- Handling login mobile diperbaiki agar respons/error API terbaca jelas dan aplikasi tidak pindah ke Home sebelum profil berhasil dimuat.
- TypeScript mobile lulus dan APK `developmentQa` terbaru berhasil dibuild. APK ini masih ditandatangani debug untuk audit lokal, bukan untuk Google Play.
- APK QA terbaru berhasil di-install ke emulator. Log menunjukkan `[QA auto-login] signed in` dan UI siswa terbuka pada layar progress dengan data fase/interview.
- Smoke test end-to-end lokal siswa lulus untuk Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch/session recovery.
- Formal QA batch 1 selesai: API health HTTP 200, backend PHPUnit 2 tests passed, CMS production build, mobile TypeScript, mojibake scan, dan secret hygiene lulus.
- Negative mobile QA batch 1 selesai: credential salah, logout, API tidak tersedia, expired/invalid session, access boundary student/admin, permission denial, background/resume, dan rotasi device sudah diuji pada emulator.
- Mobile Jest belum menjadi gate QA karena `App-test.tsx` legacy mengimpor banyak native SDK tanpa mock lengkap; blocker test infrastructure sudah dicatat terpisah dari runtime APK.
- Login otomatis dari `.env` hanya untuk QA lokal; credential contoh tidak lagi ditanam sebagai fallback di source.
- Build type `qa` sekarang mengizinkan HTTP cleartext hanya melalui manifest `mobile/android/app/src/qa/AndroidManifest.xml`, karena backend emulator lokal memakai `10.0.2.2`; production tetap tidak diberi izin HTTP cleartext.
- Build lokal saat ini memakai Node 24 karena dependency Metro yang terpasang (`metro-config` 0.83.x) mensyaratkan Node 20.19.4 atau lebih baru. Penyelarasan dependency dengan baseline Node 18 dicatat sebagai hardening build terpisah.
- Preflight `bundleProductionRelease` sudah dijalankan; R8/minification berhasil setelah heap Gradle dinaikkan menjadi 3 GB.
- Production signing belum tersedia: keystore upload dan credential `MYAPP_UPLOAD_*` belum diset, sehingga AAB belum terbentuk.
- Guard signing sudah ditambahkan agar build production gagal dengan pesan yang jelas, bukan `NullPointerException`.
- Paket eksekusi UAT client sudah siap dikirim dan diisi oleh reviewer.
- Internal UAT baseline sudah dijalankan dengan hasil `CONDITIONAL PASS`; detail evidence dipisahkan dari approval client.
- Fresh SQLite migration dan seed seluruh domain sudah lulus; path DB lokal lama ditemukan dan dikoreksi tanpa memasukkan `.env` ke repo.

## Stage Saat Ini

Stage sekarang: **Stage 6 - Formal QA & UAT, negative mobile QA batch 1 selesai**

Mapping stage:

| Stage | Nama Stage | Status |
| --- | --- | --- |
| 1 | Repo recovery & cleanup dari source handoff | Selesai |
| 2 | Local backend/CMS/mobile setup | Selesai untuk local dev |
| 3 | Audit CMS dan flow admin dasar | Sebagian besar selesai |
| 4 | Audit dan stabilisasi mobile siswa | Core flow dan recovery utama selesai; edge case sudah masuk QA |
| 5 | Data/i18n/backend schema hardening | Sebagian selesai; course bilingual sudah ada, forum/notifikasi dinamis masih pending |
| 6 | QA end-to-end dan UAT client | QA batch 1 dan negative mobile batch 1 selesai; internal baseline conditional pass, eksekusi client masih pending |
| 7 | Release preparation Google Play | Preflight sudah dilakukan; signing/AAB, production config, compliance, dan Play Console masih pending |

## Progress Per Area

| Area | Estimasi Progress | Status |
| --- | ---: | --- |
| Repo, struktur, dokumentasi awal | 90% | Repo sudah rapi, README/docs aktif diperbarui |
| Backend local development | 75% | Laravel local jalan, SQLite dan local auth fallback sudah bisa dipakai |
| CMS local/admin | 70% | CMS bisa login admin dan beberapa fitur sudah diaudit |
| Mobile Android build | 75% | APK development debug berhasil build/install di emulator |
| Mobile siswa core flow | 70% | Login, session recovery, progress, training, dokumen, forum, notifikasi dasar sudah diaudit |
| Training module/progress logic | 80% | Bug NaN, mismatch progress, detail training sudah diperbaiki |
| Media/document handling | 65% | Handling UI sudah lebih aman, tetapi file GCS/production media masih perlu validasi |
| i18n/mixed language | 45% | Teks statis penting, course category, dan course item/module mulai rapi; forum topic dan notification data masih perlu schema/backend/CMS |
| QA/UAT formal | 40% | Internal baseline conditional pass; migration reproducibility, edge case khusus, dan UAT client masih pending |
| Google Play release readiness | 25% | Environment dan preflight sudah dicek; signing/AAB, Play Console, privacy policy, production env, dan store assets belum selesai |

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

## Temuan/Risiko Utama

| Risiko | Dampak | Status |
| --- | --- | --- |
| Data production belum divalidasi penuh | Bisa beda dengan seed lokal | Perlu akses/staging production-like |
| i18n data dinamis belum full bilingual | Teks course item, forum topic, notification masih bisa campur bahasa | Perlu desain schema/backend/CMS |
| Media GCS/file production belum tervalidasi | Preview gambar/video/audio bisa gagal jika permission/storage salah | Perlu audit storage production |
| QA formal belum lengkap | Bug edge case mungkin belum terlihat | Perlu test plan dan UAT |
| Toast `Error internal server` transient saat startup/recovery | User melihat error generik walaupun session akhirnya pulih | P2 open; endpoint pemicu perlu diisolasi |
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

1. **Tutup gate QA yang tersisa**
   - Null/incomplete data, network lambat, dan double tap submit.
   - Putuskan apakah blocker Jest legacy akan diperbaiki atau diberi waiver.
   - Isolasi toast `Error internal server` transient pada startup/recovery.

2. **Audit production/staging readiness**
   - Env backend.
   - Firebase config.
   - Storage/media.
   - Payment/vendor.

3. **Jalankan UAT client**
   - Login/logout/session.
   - Home/progress/training.
   - Dokumen.
   - Forum/notifikasi.
   - Payment.
   - Sertifikasi/final interview.

4. **Lengkapi release signing dan build AAB**
   - Minta keystore upload resmi dari owner atau buat sekali dengan persetujuan owner.
   - Simpan keystore dan password di luar repo.
   - Set `MYAPP_UPLOAD_*` pada mesin build.
   - Jalankan ulang `bundleProductionRelease` dan simpan checksum AAB.

5. **Siapkan release track**
   - Debug APK untuk internal review.
   - Staging/release APK atau AAB.
   - Google Play checklist.

## Status yang Bisa Disampaikan ke Klien

Versi singkat:

> Project sudah masuk fase stabilisasi aplikasi mobile siswa. Source handoff sudah dirapikan ke repo, backend/CMS/mobile sudah bisa berjalan lokal, APK Android sudah berhasil dibuild dan diuji di emulator. Beberapa bug penting sudah diperbaiki, termasuk session recovery, blank screen setelah relaunch, progress training NaN, mismatch progress training, dokumen, dan i18n awal. Saat ini kesiapan menuju internal release candidate sekitar 60-65%. Untuk rilis Google Play production masih perlu fase QA/UAT, validasi environment production, signing, Firebase/storage/payment, dan persiapan store listing.

Versi timeline:

> Estimasi APK internal untuk review bisa disiapkan dalam 3-5 hari kerja setelah scope review disepakati. Release candidate staging realistis 1-2 minggu. Rilis Google Play production realistis 3-5 minggu, tergantung kesiapan akses production, Play Console, Firebase, storage, payment, privacy policy, dan hasil UAT.
