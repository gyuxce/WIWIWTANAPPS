# Wiwitan Android Release Readiness

Dokumen ini berisi urutan release aplikasi Android. Jangan menaruh password,
keystore, token, atau file `.env.production` ke repository.

## Status Saat Ini

- Package: `com.wiwitanbaru.wiwitan`
- Production version saat ini: `1.2.3` / `versionCode 25`
- Rilis berikutnya wajib memakai `versionCode` lebih besar dari `25`.
- Upload key baru sudah dibuat di luar repository.
- Reset upload key di Google Play Console masih pending.
- `.env.production` belum dibuat karena URL production belum tersedia.
- Backend staging membutuhkan microservice Dolphin dan Sardine; Sailfish
  diperlukan untuk alur notifikasi yang menggunakannya.

## Sebelum Build Release

1. Tunggu reset upload key Google Play selesai.
2. Pastikan file keystore tetap tersimpan di luar repository.
3. Buat `.env.production` dari `.env.production.example`.
4. Isi hanya URL HTTPS production yang sebenarnya, bukan IP staging.
5. Pastikan API, CMS, database, Firebase, dan Sardine production tersedia.
6. Naikkan `versionCode` dari `25` ke `26` dan tentukan `versionName` release.

## Gradle Signing Lokal

Gunakan Gradle properties lokal atau environment variable PowerShell. Jangan
menulis credential ke file repository.

Properties yang dibutuhkan oleh `android/app/build.gradle`:

```text
MYAPP_UPLOAD_STORE_FILE
MYAPP_UPLOAD_STORE_PASSWORD
MYAPP_UPLOAD_KEY_ALIAS
MYAPP_UPLOAD_KEY_PASSWORD
```

Keystore yang digunakan adalah file `.jks` yang dibuat di folder Documents
lokal. Alias upload: `wiwitan-upload`.

## Build AAB

Jalankan dari PowerShell lokal pada folder `D:\wiwitan\mobile`:

```powershell
yarn build:aab:prod
```

Output yang diharapkan:

```text
android/app/build/outputs/bundle/productionRelease/
```

## Gate Sebelum Upload

- Build production berhasil.
- AAB ditandatangani dengan upload key baru.
- `versionCode` sudah `26` atau lebih tinggi.
- APK/AAB diuji pada device atau emulator.
- Login siswa dan admin berhasil terhadap backend production.
- Training, dokumen, forum, notifikasi, dan logout diuji.
- Tidak ada secret di Git status.
- Backup database production sudah tersedia.

## Urutan Upload Play Console

1. Upload AAB ke track Internal testing terlebih dahulu.
2. Install dari Internal testing dan lakukan smoke test.
3. Perbaiki blocker yang ditemukan.
4. Ajukan ke Closed testing atau Production sesuai keputusan client.

