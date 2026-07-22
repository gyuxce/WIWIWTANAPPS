# Google Play Release Checklist - WIWITAN Apps

Tanggal update: 22 Juli 2026

Checklist ini dipakai saat project mulai masuk fase rilis Android production. Jangan publish sebelum semua item wajib di bawah selesai.

## 1. Status Saat Ini

Project belum siap publish production. Posisi sekarang masih **release preparation awal**:

- APK development sudah bisa dibuild dan diinstall ke emulator.
- Flow siswa utama sudah mulai stabil.
- Production signing belum divalidasi.
- AAB production belum dibuild dan dites.
- Play Console, privacy policy, data safety, Firebase production, storage, payment, dan backend production belum diaudit penuh.

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
.\gradlew.bat app:bundleProductionRelease --no-daemon --stacktrace --max-workers=2
```

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
