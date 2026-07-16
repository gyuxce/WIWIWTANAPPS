# Project Structure

Repo ini memakai format monorepo supaya mobile, backend, CMS, dan dokumentasi berada dalam satu tempat.

## Root

- `.gitattributes` - menjaga line ending dan file binary.
- `.gitignore` - ignore global untuk secrets, dependency, dan build output.
- `README.md` - entry point dokumentasi project.
- `docs/` - dokumentasi project.

## `backend/`

Laravel API dan microservices.

Bagian penting:

- `app/` - controller, model, service, middleware, request, resource.
- `routes/` - route API/web.
- `database/` - migrations, seeders, factories.
- `config/` - konfigurasi Laravel.
- `microservices/` - service tambahan seperti Dolphin, Sailfish, Sardine, dan Goldfish.
- `.env.example` - template konfigurasi backend.

Backend harus berjalan lebih dulu karena CMS dan mobile bergantung ke API.

## `cms/`

Dashboard/admin berbasis React.

Bagian penting:

- `src/` - source aplikasi CMS.
- `public/` - static public assets.
- `.env.example` - template konfigurasi CMS.
- `package.json` - script dan dependency CMS.

## `mobile/`

Aplikasi mobile React Native.

Bagian penting:

- `src/` - source TypeScript React Native.
- `android/` - project native Android.
- `ios/` - project native iOS.
- `patches/` - patch dependency yang dijalankan via `patch-package`.
- `.env.example` - template konfigurasi mobile.
- `package.json` - script dan dependency mobile.

Flavor Android:

- `development`
- `staging`
- `production`

## `docs/`

Dokumentasi pendukung:

- `SECRETS_REQUIRED.md` - daftar file/credential yang harus tersedia lokal.
- `SETUP_CHECKLIST.md` - checklist setup pertama.
- `handoff-instruksi-original.txt` - instruksi original dari handoff zip.

## File Rahasia

File rahasia tidak boleh masuk Git. Simpan di storage aman, lalu copy ke path yang dibutuhkan saat setup lokal/build.
