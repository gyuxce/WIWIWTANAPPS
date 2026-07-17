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

Untuk build Android di Windows, install dan siapkan:

- Android Studio.
- Android SDK Platform 35.
- Android SDK Platform-Tools, agar `adb` tersedia.
- JDK yang kompatibel dengan React Native/Android Gradle Plugin.
- Emulator Android atau HP Android dengan USB debugging.

Environment penting:

```powershell
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
$env:Path="$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

Jika memakai JDK bawaan Android Studio:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

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

## Status Audit Lokal

- `mobile/.env` sudah disiapkan untuk Android emulator.
- `debug.keystore` dan `google-services.json` sudah bisa direstore dari `secrets-local`.
- Login screen mobile sudah mengirim `is_mobile: "1"`.
- Build Android belum diverifikasi di mesin ini karena `adb` dan `JAVA_HOME` belum tersedia di PATH.
- Install dependency sempat gagal di cache Yarn global dengan error `EPERM`, lalu retry cache lokal timeout sebelum `node_modules` terbentuk.
