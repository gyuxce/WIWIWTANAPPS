# Mobile Screen Audit

Audit layar aplikasi siswa Android lokal.

## Environment

- Emulator: `Pixel_8`
- App variant: `developmentDebug`
- Backend: `http://127.0.0.1:8000` dan emulator via `http://10.0.2.2:8000`
- CMS: `http://127.0.0.1:3000`
- Student seed:
  - Email: `user1@62teknologi.com`
  - Password: `password`

## Status Audit

### Login dan Session

- Login siswa dengan seed berhasil.
- Token lokal `local.*` tersimpan di Redux persist.
- App berhasil masuk ke `HomeScreen`.
- Catatan: setelah patch backend, proses `php artisan serve` harus direstart agar kode terbaru aktif.

### Home

- Status fase 1 tampil.
- Pra Tes card tampil.
- Trending forum kosong tampil sebagai empty state.
- Belajar lebih jauh tampil.

### Drawer

- Profil user tampil.
- Menu utama tampil: Beranda, Progress Pelatihan, Forum, Dokumen Saya, Profil.
- Untuk user `last_phase = 1`, fase 2 sampai 5 terkunci. Ini sesuai data user.

### Pra Tes

- Layar Pra Tes tampil.
- Status Tes Bakat Bahasa dan Sesi Tanya Jawab terbaca selesai.
- Tes Karakter tampil disabled sesuai data progress.
- Tidak ada error backend saat membuka layar.

### Dokumen Saya

- Endpoint dokumen berhasil mengembalikan data.
- Dokumen tampil setelah data selesai dimuat.
- Perbaikan: layar sekarang menampilkan loading saat fetch dokumen awal, bukan empty state sementara.
- Verifikasi emulator: daftar dokumen tampil langsung dengan data `Ijazah`, `CV`, `Paspor`, dan dokumen lain milik siswa.

### Forum

- Layar Forum terbuka.
- Trending post kosong tampil sebagai empty state.
- Perbaikan: loading `Topik Populer` sekarang selalu berhenti walaupun dependency constants gagal atau data kosong.
- Perbaikan: topik `PAP`, `Diskusi Umum`, dan `Curhat` sekarang ikut dipetakan di mobile, sehingga data populer seed lokal tidak hilang saat render.
- Verifikasi emulator: `Topik Populer` tampil dengan `PAP`, `Diskusi Umum`, dan `Curhat`; tidak lagi stuck spinner.

## Temuan Lanjutan

- Audit fase 2 sampai 5 butuh seed user dengan `last_phase` lebih tinggi atau data user local yang dinaikkan sementara.
- Log debug Redux sangat verbose di Logcat. Ini membantu audit, tapi sebaiknya dimatikan untuk build release.
- Warning Metro websocket `10.0.2.2:8081` muncul pada APK debug tanpa Metro berjalan. Ini tidak fatal selama APK punya bundled JS.
