# Mobile Android Local Development

Panduan ini untuk menjalankan aplikasi siswa React Native di Windows dengan backend dan CMS lokal.

## Konsep Login

CMS dan mobile memakai endpoint auth yang sama, tetapi konteksnya berbeda:

- Admin CMS login dari dashboard dengan `is_mobile=0`.
- Siswa login dari aplikasi mobile dengan `is_mobile=1`.
- Akun siswa seed `user1@62teknologi.com` tidak punya `role_id`, jadi memang ditolak ketika dipakai masuk CMS.

Seed student/mobile login:

```text
Email: user1@62teknologi.com
Password: password
```

## Prasyarat

Pastikan backend dan CMS lokal sudah berjalan:

```text
Backend: http://127.0.0.1:8000
CMS:     http://127.0.0.1:3000
```

Untuk Android emulator, backend harus bind ke `0.0.0.0:8000` supaya bisa diakses dari app lewat `10.0.2.2`. Script `.\scripts\backend-serve.ps1` sudah memakai host tersebut.

Untuk build Android di Windows, install dan siapkan:

- Android Studio.
- Android SDK Platform 35.
- Android SDK Platform-Tools, agar `adb` tersedia.
- JDK yang kompatibel dengan React Native/Android Gradle Plugin.
- Emulator Android atau HP Android dengan USB debugging.

## Setup Android Studio Pertama Kali

Setelah Android Studio selesai di-install:

1. Buka Android Studio.
2. Jika muncul setup wizard, pilih `Standard`.
3. Tunggu semua komponen selesai di-download.
4. Buka `More Actions` > `SDK Manager`.
5. Di tab `SDK Platforms`, centang `Android 15.0 ("VanillaIceCream")` atau platform dengan API level 35.
6. Di tab `SDK Tools`, centang:
   - `Android SDK Build-Tools`
   - `Android SDK Platform-Tools`
   - `Android Emulator`
   - `Android SDK Command-line Tools (latest)`
7. Klik `Apply` dan tunggu sampai selesai.
8. Buka `More Actions` > `Virtual Device Manager`.
9. Klik `Create Device`, pilih device seperti `Pixel 7` atau `Pixel 8`.
10. Pilih system image API 35, download jika belum ada.
11. Finish, lalu klik tombol play untuk menjalankan emulator.

Catatan: versi Android Emulator seperti `28.2.13676358` adalah versi tool emulator dari Android Studio, bukan versi Android OS aplikasi. Untuk project ini yang penting adalah API 35/Android 15 tersedia dan emulator bisa start.

Setelah itu cek dari terminal:

```powershell
.\scripts\android-env.ps1
adb devices
emulator -list-avds
```

Environment penting yang dimuat oleh script:

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:Path="$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

Jika memakai JDK bawaan Android Studio:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

Lebih praktisnya, jalankan:

```powershell
.\scripts\android-env.ps1
```

Jika repo dipindah ke path pendek seperti `D:\wiwitan`, script `.\scripts\dev-env.ps1` tetap memakai portable PHP/Node dari workspace handoff lama jika folder `tools` belum ada di drive tersebut.

## File Lokal

File berikut dibutuhkan secara lokal dan tidak boleh di-commit:

- `mobile/.env`
- `mobile/android/app/debug.keystore`
- `mobile/android/app/google-services.json`

Untuk Android emulator, isi `mobile/.env`:

```env
STATUS=DEVELOPMENT
API_URL=http://10.0.2.2:8000/api/v1
URL_CMS=http://10.0.2.2:3000
URL_SCHEME=wiwitan
WEB_CLIENT_ID=
FB_APP_ID=
FB_CLIENT_TOKEN=
PROD_KEYSTORE_FILE=
PROD_KEYSTORE_PASSWORD=
PROD_KEY_ALIAS=
PROD_KEY_PASSWORD=
```

Catatan: `10.0.2.2` adalah alamat komputer host dari Android emulator. Kalau memakai HP fisik, ganti dengan IP LAN komputer, misalnya `http://192.168.1.10:8000/api/v1`.

## Install Dependency

Repo mobile memakai Yarn. Di Windows, gunakan Node 18 untuk menghindari masalah kompatibilitas React Native:

```powershell
cd mobile
corepack enable
corepack yarn install --frozen-lockfile
```

Jika cache Yarn global Windows bermasalah, pakai cache lokal:

```powershell
corepack yarn install --frozen-lockfile --cache-folder ..\..\yarn-cache-mobile
```

## Menjalankan App

Terminal 1, jalankan Metro:

```powershell
cd mobile
yarn start --reset-cache
```

Terminal 2, install debug development build:

```powershell
cd mobile\android
.\gradlew.bat app:installDevelopmentDebug
```

Script `yarn android:dev:debug` masih memakai gaya Unix `./gradlew`, jadi di Windows lebih aman memanggil `gradlew.bat` langsung.

Untuk hanya membuat APK debug development:

```powershell
cd mobile\android
.\gradlew.bat app:assembleDevelopmentDebug --no-daemon --stacktrace --max-workers=2
```

APK lokal akan dibuat di:

```text
mobile/android/app/build/outputs/apk/development/debug/app-development-debug.apk
```

Install APK ke emulator:

```powershell
.\scripts\android-env.ps1
adb install -r .\mobile\android\app\build\outputs\apk\development\debug\app-development-debug.apk
```

## Status Audit Lokal

- `mobile/.env` sudah disiapkan untuk Android emulator.
- `debug.keystore` dan `google-services.json` sudah bisa direstore dari `secrets-local`.
- Login screen mobile sudah mengirim `is_mobile: "1"`.
- Build Android development debug sudah terverifikasi dengan Gradle.
- APK development debug sudah berhasil di-install ke emulator `Pixel_8`.
- Login siswa lokal sudah terverifikasi dengan seed `user1@62teknologi.com` / `password`.
- Backend lokal memakai fallback token `local.*`. Middleware `MobileAccess` sudah mendukung token lokal agar endpoint mobile bisa dites tanpa service Dolphin eksternal.
- Endpoint HomeScreen penting yang sudah dites lokal:
  - `GET /api/v1/mobile/base/users/user-files`
  - `GET /api/v1/mobile/forum/posts?type_post=trending`
- Query forum trending sudah dibuat kompatibel dengan SQLite lokal dengan memakai `whereRaw` untuk filter `count_like + count_comment > 0`.
