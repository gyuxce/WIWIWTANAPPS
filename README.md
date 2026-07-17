# WIWITAN Apps

Monorepo untuk ekosistem Wiwitan:

- `mobile/` - aplikasi mobile React Native.
- `backend/` - API Laravel dan microservices.
- `cms/` - dashboard/admin CMS berbasis React.
- `docs/` - dokumentasi handoff, struktur, dan kebutuhan setup.

Repo ini dibuat dari source handoff developer sebelumnya dan sudah disanitasi supaya file rahasia tidak masuk Git.

## Mulai Dari Mana?

1. Baca [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) untuk peta folder.
2. Baca [docs/SETUP_CHECKLIST.md](docs/SETUP_CHECKLIST.md) sebelum menjalankan project.
3. Siapkan file rahasia sesuai [docs/SECRETS_REQUIRED.md](docs/SECRETS_REQUIRED.md).
4. Untuk Windows local smoke test, baca [docs/LOCAL_DEV_WINDOWS.md](docs/LOCAL_DEV_WINDOWS.md).
5. Jalankan backend dulu, lalu CMS, lalu mobile app.

## Stack Utama

Backend:

- Laravel 10
- PHP 8.1/8.2
- Composer
- Database SQL
- Redis/Horizon/Telescope bila fitur queue/monitoring dipakai

CMS:

- React 18
- Create React App
- Tailwind CSS
- npm

Mobile:

- React Native 0.77.3
- Expo modules
- TypeScript
- Firebase Auth/Messaging
- Android SDK 35

## Command Cepat

Windows local development sudah diverifikasi dengan SQLite dan fallback auth lokal. Detailnya ada di [docs/LOCAL_DEV_WINDOWS.md](docs/LOCAL_DEV_WINDOWS.md).

Backend:

```powershell
.\scripts\backend-composer-install.ps1
.\scripts\backend-migrate-sqlite.ps1
.\scripts\backend-serve.ps1
```

CMS:

```powershell
cd cms
npm install
npm run start
```

Login CMS local seed:

- URL: `http://127.0.0.1:3000`
- Email: `admin@62teknologi.com`
- Password: `password`

Mobile:

```sh
cd mobile
yarn install
yarn start
yarn android:dev:debug
```

Build Android production:

```sh
cd mobile
yarn build:aab:prod
```

## Aturan Repo

- Jangan commit `.env`, keystore, Firebase service account JSON, atau credential lain.
- Update README/dokumentasi setiap ada perubahan setup, command, env, atau struktur folder.
- Simpan catatan keputusan teknis di `docs/`.
- Pastikan perubahan mobile yang bergantung backend juga dicatat kebutuhan API-nya.

Instruksi original dari developer sebelumnya tetap disimpan di [docs/handoff-instruksi-original.txt](docs/handoff-instruksi-original.txt).
