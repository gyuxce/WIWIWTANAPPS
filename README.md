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
5. Untuk hasil audit CMS terakhir, baca [docs/CMS_AUDIT.md](docs/CMS_AUDIT.md).
6. Untuk menjalankan aplikasi siswa Android lokal, baca [docs/MOBILE_LOCAL_ANDROID.md](docs/MOBILE_LOCAL_ANDROID.md).
7. Untuk hasil audit layar mobile, baca [docs/MOBILE_SCREEN_AUDIT.md](docs/MOBILE_SCREEN_AUDIT.md).
8. Untuk laporan stage, persentase, risiko, dan estimasi rilis, baca [docs/PROJECT_STATUS_REPORT.md](docs/PROJECT_STATUS_REPORT.md).
9. Untuk persiapan rilis Google Play, baca [docs/GOOGLE_PLAY_RELEASE_CHECKLIST.md](docs/GOOGLE_PLAY_RELEASE_CHECKLIST.md).
10. Untuk test matrix formal QA/UAT, baca [docs/QA_UAT_TEST_PLAN.md](docs/QA_UAT_TEST_PLAN.md).
11. Untuk report progres Juli-Agustus dan action plan client, baca [docs/CLIENT_PROGRESS_REPORT_JULY_AUGUST_2026.md](docs/CLIENT_PROGRESS_REPORT_JULY_AUGUST_2026.md).
12. Untuk paket eksekusi dan sign-off UAT client, baca [docs/UAT_CLIENT_EXECUTION_PACK.md](docs/UAT_CLIENT_EXECUTION_PACK.md).
13. Untuk hasil pengujian internal terbaru, baca [docs/INTERNAL_UAT_REPORT_2026-08-01.md](docs/INTERNAL_UAT_REPORT_2026-08-01.md).
14. Untuk hasil negative test batch 2, baca [docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md](docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md).
15. Jalankan backend dulu, lalu CMS, lalu mobile app.

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

`backend-serve.ps1` bind ke `0.0.0.0:8000` supaya Android emulator bisa mengakses API lewat `http://10.0.2.2:8000`.

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

```powershell
.\scripts\android-env.ps1
cd mobile
corepack yarn install --frozen-lockfile
cd android
.\gradlew.bat app:assembleDevelopmentDebug --no-daemon --stacktrace --max-workers=2
```

Login mobile local seed:

- Email: `user1@62teknologi.com`
- Password: `password`

Cek encoding/mojibake source dan SQLite lokal:

```powershell
python scripts/check-mojibake.py
```

Audit mobile terakhir:

- Layar siswa, dokumen, forum, dan progress fase sudah diaudit di emulator.
- Fase pembayaran sudah diberi guard agar tidak crash saat detail cicilan seed lokal belum lengkap.
- Fase pelatihan sudah bisa dibuka dengan seed lokal subscription aktif dan `training_program=2`.
- Detail modul, level, grup materi, layar materi, handling error media, tab kelas virtual, dan tab asesmen sudah diaudit. Detailnya ada di [docs/MOBILE_SCREEN_AUDIT.md](docs/MOBILE_SCREEN_AUDIT.md).
- TypeScript mobile sudah lolos `corepack yarn tsc --noEmit` dan build `developmentDebug` berhasil.
- Negative test batch 2 sudah mereproduksi double-submit forum sebelum fix, menambahkan guard submit dan null-safety training. Detail status partial, blocked, dan retest ada di [docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md](docs/NEGATIVE_TEST_BATCH_2_2026-08-01.md).

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
