# Google Play Release Checklist - WIWITAN Apps

Tanggal update: 1 Agustus 2026

Checklist ini dipakai saat project mulai masuk fase rilis Android production. Jangan publish sebelum semua item wajib di bawah selesai.

## 1. Status Saat Ini

Project belum siap publish production. Posisi sekarang masih **release preparation awal**, berjalan paralel dengan QA/UAT:

- Environment Android lokal sudah tervalidasi: JDK Android Studio, SDK, NDK, dan Gradle dapat dipakai.
- APK development/QA sudah bisa dibuild dan diinstall ke emulator.
- Flow siswa utama sudah mulai stabil.
- Preflight `bundleProductionRelease` sudah dijalankan; R8 berhasil setelah heap Gradle dinaikkan.
- Production signing masih **BLOCKED** karena keystore upload dan credential `MYAPP_UPLOAD_*` belum tersedia.
- AAB production belum terbentuk karena proses berhenti di tahap signing.
- Play Console, privacy policy, data safety, Firebase production, storage, payment, dan backend production belum diaudit penuh.

## 1A. Latest Local Release Preflight - 1 Agustus 2026

| Check | Result | Catatan |
| --- | --- | --- |
| Android environment | PASS | `ANDROID_HOME`, JDK Android Studio, SDK Platform 35, NDK `28.2.13676358`, dan Gradle 8.9 terdeteksi |
| Production flavor/config | PASS | Variant `productionRelease` dan task bundle tersedia |
| JavaScript/native compilation | PASS | Build maju sampai tahap bundle signing |
| R8/minification | PASS | Lolos dengan Gradle heap 3 GB dan workers 1 |
| Release signing | BLOCKED | `mobile/android/app/wiwitan.keystore` belum tersedia; empat `MYAPP_UPLOAD_*` belum diset |
| Production AAB | BLOCKED | Belum ada file `.aab` yang dapat diupload |

Catatan non-blocking: Gradle masih menampilkan warning penggunaan `ndk.dir` yang deprecated dan build lokal perlu `NODE_ENV=production` agar pemilihan env Expo eksplisit.

## 2. Akses yang Harus Dikumpulkan

Minta ke client atau owner project:

- Akses Google Play Console.
- Akses Firebase Console project production.
- Akses backend production/staging.
- Akses database staging/production atau minimal staging dump.
- Akses storage bucket/media production.
- Akses payment dashboard/API key production atau sandbox resmi.
- Privacy policy URL.
- App icon final, feature graphic, screenshot store listing.
- Keputusan final package name: `com.wiwitanbaru.wiwitan`.

## 3. Signing Android

File yang dibutuhkan lokal:

- `mobile/android/app/wiwitan.keystore`

Credential signing tidak boleh ditulis di repo. Simpan di local machine atau secret manager.

Konfigurasi `PROD_KEYSTORE_*` di `mobile/.env` tidak otomatis dipakai oleh Gradle signing. Untuk build release, map nilainya secara aman ke `MYAPP_UPLOAD_*` melalui environment variable atau `~/.gradle/gradle.properties`; jangan menyalin password ke README atau commit.

Opsi lokal via environment variable PowerShell:

```powershell
$env:MYAPP_UPLOAD_STORE_FILE="wiwitan.keystore"
$env:MYAPP_UPLOAD_KEY_ALIAS="wiwitan"
$env:MYAPP_UPLOAD_STORE_PASSWORD="<password-keystore>"
$env:MYAPP_UPLOAD_KEY_PASSWORD="<password-key>"
```

Opsi lokal via `~/.gradle/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=wiwitan.keystore
MYAPP_UPLOAD_KEY_ALIAS=wiwitan
MYAPP_UPLOAD_STORE_PASSWORD=<password-keystore>
MYAPP_UPLOAD_KEY_PASSWORD=<password-key>
```

Catatan: password contoh/dummy tidak boleh dipakai untuk production.

## 4. Firebase dan Env Production

Pastikan file berikut sudah benar untuk production:

- `mobile/android/app/google-services.json`
- `mobile/.env`

Minimal cek isi `mobile/.env` untuk release:

```env
STATUS=PRODUCTION
API_URL=https://<domain-production>/api/v1
URL_CMS=https://<domain-cms-production>
URL_SCHEME=wiwitan
WEB_CLIENT_ID=<production-web-client-id>
FB_APP_ID=<production-facebook-app-id>
FB_CLIENT_TOKEN=<production-facebook-client-token>
```

## 5. Build AAB Production

Dari root repo, siapkan environment Android:

```powershell
.\scripts\android-env.ps1
```

Build AAB:

```powershell
cd mobile\android
$env:NODE_ENV="production"
.\gradlew.bat app:bundleProductionRelease --no-daemon --stacktrace --max-workers=1
```

Build akan berhenti dengan pesan yang jelas bila signing belum lengkap. Jangan memakai debug keystore untuk upload ke Google Play.

Output:

```text
mobile/android/app/build/outputs/bundle/productionRelease/app-production-release.aab
```

## 6. Smoke Test Sebelum Upload

Sebelum AAB diupload ke Play Console:

- Build `productionRelease` berhasil tanpa error signing.
- Install APK staging/release internal ke emulator atau device fisik.
- Login siswa berhasil.
- Relaunch app tidak blank dan session recovery stabil.
- Home, Progress, Training, Dokumen, Forum, Notifikasi bisa dibuka.
- Media gambar/video/audio bisa tampil dari storage production/staging.
- Push notification dites di device fisik.
- Payment/transaction dites minimal di sandbox/staging.
- Tidak ada log debug sensitif pada release build.
- App version `versionCode` dan `versionName` sudah dinaikkan bila perlu.

## 7. Play Console

Yang perlu disiapkan di Play Console:

- App bundle `.aab`.
- App name dan short description.
- Full description.
- App icon.
- Feature graphic.
- Phone screenshots.
- Privacy policy URL.
- Data safety form.
- Content rating questionnaire.
- Target audience.
- App access instruction bila Google reviewer butuh akun login.

Contoh akun reviewer:

```text
Email: <akun-reviewer-client>
Password: <password-reviewer>
```

Jangan memakai akun pribadi atau credential admin production untuk reviewer.

## 8. Gate Rilis

Rilis production boleh dilakukan setelah:

- Client approve UAT.
- Backend production stabil.
- Firebase production final.
- Storage/media production final.
- Payment production final.
- Signing key aman.
- AAB production berhasil.
- Checklist QA mobile dan CMS selesai.
- Known issue disetujui client.
