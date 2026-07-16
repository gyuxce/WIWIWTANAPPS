# Setup Checklist

Gunakan checklist ini saat pertama kali menjalankan project di mesin baru.

## 1. Repository

- Clone repo private ini.
- Pastikan branch utama adalah `main`.
- Jangan commit file dari local secret storage.

## 2. Backend

- Install PHP 8.1/8.2.
- Install Composer.
- Siapkan database lokal/staging.
- Copy `backend/.env.example` ke `backend/.env`.
- Isi konfigurasi database, Firebase, payment, mail, Redis, dan base URL.
- Restore database dump bila tersedia.
- Jalankan:

```sh
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Jika memakai data production/staging dump, pastikan tidak menjalankan migration destruktif sebelum dicek.

## 3. Microservices

- Copy env/config rahasia sesuai `docs/SECRETS_REQUIRED.md`.
- Jalankan Dolphin di terminal terpisah sesuai instruksi handoff:

```sh
cd backend/microservices/Dolphin/bin
./62dolphin
```

Di Windows, binary Linux mungkin perlu dijalankan lewat server Linux/WSL bila tidak kompatibel.

## 4. CMS

- Install Node.js.
- Copy `cms/.env.example` ke `cms/.env`.
- Isi `REACT_APP_API_HOST`.
- Jalankan:

```sh
cd cms
npm install
npm run start
```

## 5. Mobile Android

- Install Node.js 18.
- Install Yarn.
- Install Android Studio.
- Install Android SDK Platform 35.
- Install Android Build Tools 35.x.
- Install NDK `28.2.13676358`.
- Copy `mobile/.env.example` ke `mobile/.env`.
- Copy Firebase Android config ke `mobile/android/app/google-services.json`.
- Untuk release build, copy keystore ke `mobile/android/app/`.
- Jalankan:

```sh
cd mobile
yarn install
yarn start
yarn android:dev:debug
```

Build AAB production:

```sh
cd mobile
yarn build:aab:prod
```

## 6. Akses Eksternal

Pastikan akses ini tersedia:

- GitHub private repo.
- Firebase Console.
- Google Play Console.
- Backend server/staging.
- Database staging/production.
- Xendit dashboard/API keys.
- Facebook Developer app.
- Google OAuth credentials.
- Apple Developer account bila iOS dilanjutkan.

## 7. Security

- Rotate credential yang pernah dibagikan via zip/chat.
- Jangan upload `.env`, keystore, plist/json Firebase, atau service account JSON ke Git.
- Gunakan secret manager/password manager untuk credential.
