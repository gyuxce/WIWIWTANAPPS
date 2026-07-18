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

### Fase 2-5

- Audit dilakukan dengan override lokal SQLite untuk seed `user1@62teknologi.com`: `last_phase = 5` dan `join_reason` non-null.
- Drawer siswa menampilkan dropdown `Progress Pelatihan` dengan fase 1 sampai 5 enabled.
- Fase 2 Pembayaran terbuka.
- Perbaikan: `InstallmentPaymentDetailScreen` tidak lagi crash saat transaksi training belum punya detail `installment.period_length`.
- Perbaikan: tanggal jatuh tempo training yang kosong/invalid tidak lagi dirender sebagai `1970/01/01`.
- Catatan data: biaya administrasi seed lokal bernilai `IDR 0`; biaya pelatihan tampil `IDR 4,200,000`.
- Catatan data: metode pembayaran masih bergantung konfigurasi payment/Pivot dan seed transaksi, sehingga opsi pembayaran bisa belum aktif di local.
- Fase 3 Pelatihan diarahkan ke detail pembayaran training jika `user.is_subscription_active !== 1`. Ini sesuai guard mobile saat pembayaran/subscription belum aktif.
- Fase 4 Sertifikasi terbuka tanpa crash dan menampilkan card sertifikasi serta tab review kelulusan.
- Fase 5 Wawancara Final terbuka tanpa crash dan menampilkan status wawancara serta keberangkatan.

## Temuan Lanjutan

- Untuk audit materi pelatihan penuh, siapkan seed user dengan `is_subscription_active = 1` atau payment training completed.
- Log debug Redux sangat verbose di Logcat. Ini membantu audit, tapi sebaiknya dimatikan untuk build release.
- Warning Metro websocket `10.0.2.2:8081` muncul pada APK debug tanpa Metro berjalan. Ini tidak fatal selama APK punya bundled JS.
- `backend/.env` lokal saat audit menunjuk ke SQLite workspace lama. Pastikan path database disamakan sebelum handoff ke environment baru.
