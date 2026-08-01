# Project Status Report - WIWITAN Apps

Tanggal update: 1 Agustus 2026

## Ringkasan Eksekutif

Project saat ini berada di fase **stabilisasi dan audit aplikasi mobile siswa**, bukan fase release production.

Source handoff dari developer sebelumnya sudah dirapikan ke repo, environment lokal sudah bisa dijalankan, CMS dan backend lokal sudah aktif, APK Android development sudah berhasil dibuild dan diinstall ke emulator, dan flow utama siswa sudah mulai stabil.

Estimasi kesiapan keseluruhan saat ini: **60-65% menuju release candidate internal**.

Estimasi kesiapan menuju **rilis Google Play production**: **45-50%**, karena masih ada pekerjaan release engineering, QA/UAT, konfigurasi production, signing, privacy/compliance, dan validasi backend production.

## Checkpoint Terbaru - 1 Agustus 2026

- Posisi aktual: penutupan stabilisasi mobile Android, sebelum QA/UAT formal.
- Login API siswa tervalidasi dengan HTTP 200 dari backend lokal.
- Handling login mobile diperbaiki agar respons/error API terbaca jelas dan aplikasi tidak pindah ke Home sebelum profil berhasil dimuat.
- TypeScript mobile lulus dan APK `developmentQa` terbaru berhasil dibuild. APK ini masih ditandatangani debug untuk audit lokal, bukan untuk Google Play.
- APK QA terbaru berhasil di-install ke emulator. Log menunjukkan `[QA auto-login] signed in` dan UI siswa terbuka pada layar progress dengan data fase/interview.
- Smoke test end-to-end lokal siswa lulus untuk Home, Progress, Training, Detail Training, Dokumen, Forum, Notifikasi, dan relaunch/session recovery.
- Login otomatis dari `.env` hanya untuk QA lokal; credential contoh tidak lagi ditanam sebagai fallback di source.
- Build type `qa` sekarang mengizinkan HTTP cleartext hanya melalui manifest `mobile/android/app/src/qa/AndroidManifest.xml`, karena backend emulator lokal memakai `10.0.2.2`; production tetap tidak diberi izin HTTP cleartext.
- Build lokal saat ini memakai Node 24 karena dependency Metro yang terpasang (`metro-config` 0.83.x) mensyaratkan Node 20.19.4 atau lebih baru. Penyelarasan dependency dengan baseline Node 18 dicatat sebagai hardening build terpisah.

## Stage Saat Ini

Stage sekarang: **Stage 4 - Mobile Student Stabilization & Polish, gate login QA sudah ditutup**

Mapping stage:

| Stage | Nama Stage | Status |
| --- | --- | --- |
| 1 | Repo recovery & cleanup dari source handoff | Selesai |
| 2 | Local backend/CMS/mobile setup | Selesai untuk local dev |
| 3 | Audit CMS dan flow admin dasar | Sebagian besar selesai |
| 4 | Audit dan stabilisasi mobile siswa | Smoke test local QA selesai; polish dan edge case masih berjalan |
| 5 | Data/i18n/backend schema hardening | Sebagian selesai; course bilingual sudah ada, forum/notifikasi dinamis masih pending |
| 6 | QA end-to-end dan UAT client | Gate berikutnya; smoke test lokal sudah menjadi baseline |
| 7 | Release preparation Google Play | Belum mulai |

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
| QA/UAT formal | 25% | Audit manual lokal sudah berjalan, test plan formal belum lengkap |
| Google Play release readiness | 25% | Release checklist dan signing config sudah mulai dirapikan; Play Console, privacy policy, production env, dan release build final belum selesai |

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
- Hasil audit dicatat di `docs/MOBILE_SCREEN_AUDIT.md`.

## Temuan/Risiko Utama

| Risiko | Dampak | Status |
| --- | --- | --- |
| Data production belum divalidasi penuh | Bisa beda dengan seed lokal | Perlu akses/staging production-like |
| i18n data dinamis belum full bilingual | Teks course item, forum topic, notification masih bisa campur bahasa | Perlu desain schema/backend/CMS |
| Media GCS/file production belum tervalidasi | Preview gambar/video/audio bisa gagal jika permission/storage salah | Perlu audit storage production |
| QA formal belum lengkap | Bug edge case mungkin belum terlihat | Perlu test plan dan UAT |
| Release Google Play belum disiapkan | Belum bisa publish production | Perlu keystore, signing, Play Console, privacy, AAB |
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

1. **Pilih scope i18n berikutnya**
   - Opsi A: Forum topic bilingual.
   - Opsi B: Course item/module bilingual.
   - Rekomendasi: course item/module dulu, karena lebih sering dilihat siswa di training.

2. **Audit production/staging readiness**
   - Env backend.
   - Firebase config.
   - Storage/media.
   - Payment/vendor.

3. **Buat QA checklist**
   - Login/logout/session.
   - Home/progress/training.
   - Dokumen.
   - Forum/notifikasi.
   - Payment.
   - Sertifikasi/final interview.

4. **Siapkan release track**
   - Debug APK untuk internal review.
   - Staging/release APK atau AAB.
   - Google Play checklist.

## Status yang Bisa Disampaikan ke Klien

Versi singkat:

> Project sudah masuk fase stabilisasi aplikasi mobile siswa. Source handoff sudah dirapikan ke repo, backend/CMS/mobile sudah bisa berjalan lokal, APK Android sudah berhasil dibuild dan diuji di emulator. Beberapa bug penting sudah diperbaiki, termasuk session recovery, blank screen setelah relaunch, progress training NaN, mismatch progress training, dokumen, dan i18n awal. Saat ini kesiapan menuju internal release candidate sekitar 60-65%. Untuk rilis Google Play production masih perlu fase QA/UAT, validasi environment production, signing, Firebase/storage/payment, dan persiapan store listing.

Versi timeline:

> Estimasi APK internal untuk review bisa disiapkan dalam 3-5 hari kerja setelah scope review disepakati. Release candidate staging realistis 1-2 minggu. Rilis Google Play production realistis 3-5 minggu, tergantung kesiapan akses production, Play Console, Firebase, storage, payment, privacy policy, dan hasil UAT.
