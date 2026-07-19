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

### Fase 3 Pelatihan

- Seed lokal untuk audit: `user1@62teknologi.com` memakai `last_phase = 5`, `is_subscription_active = 1`, dan `training_program = 2`.
- Catatan data: sebelumnya user seed memakai `training_program = 1`, sedangkan `course_items.program_type` lokal berisi `2`; akibatnya detail modul kosong walaupun progress parent menampilkan jumlah materi. Setelah `training_program` disamakan ke `2`, endpoint `/mobile/training/module/materi/content` mengembalikan konten.
- Layar `TrainingScreen` terbuka tanpa redirect ke pembayaran dan menampilkan kategori `Teori Bahasa Jepang`, `Praktik Bahasa Jepang`, serta `Soft Skill Bahasa Jepang`.
- Detail `Teori Bahasa Jepang` terbuka tanpa crash. Tab modul menampilkan level `N4` dan `N5`.
- Level `N4` menampilkan grup `Bahasa Jepang Menengah`, lalu grup tersebut menampilkan materi `Bahasa Jepang 1` dan `Bahasa Jepang 2`.
- Layar detail materi terbuka untuk materi `Partikel dalam Kalimat` dan menampilkan judul, tipe konten, attachment file, serta area WebView/media.
- Audit media: tabel `files` seed lokal berisi 3 file GCS (`jpg`, `mp3`, `mp4`) dan request host ke URL GCS mengembalikan `403 Forbidden`.
- Perbaikan backend: `FileResource` sekarang mengembalikan URL `storage/...` saat file memakai adapter `local/public` dan file tersebut tersedia di `storage/app/public`.
- Perbaikan mobile: `ContentDetailScreen` sekarang mengenali ekstensi image dan merender dokumen image langsung dengan `<Image>`, bukan dipaksa lewat Google Docs Viewer. Jika video/dokumen/media gagal dimuat, layar menampilkan pesan error singkat, bukan spinner kosong terus.
- Catatan lanjut: agar preview media benar-benar tampil, file GCS dev bucket perlu dibuat accessible atau seed lokal perlu diarahkan ke file `storage/app/public` yang tersedia.
- API tab virtual class untuk kategori Teori mengembalikan data: `N4` punya 2 kelas dan `N5` punya 2 kelas.
- API tab asesmen untuk kategori Teori mengembalikan data: `N4` punya 2 asesmen dan `N5` punya 2 asesmen.
- Perbaikan mobile: query tab virtual class dan asesmen sekarang dibangun dengan encoder query yang sama seperti endpoint lain, sehingga nilai kosong tidak terkirim sebagai `undefined`.
- Perbaikan mobile: tab kelas virtual dan asesmen sekarang memiliki loading state, pesan error fetch, dan empty state setelah filter/search.
- Catatan UI: setelah patch ini, perlu install ulang APK dan ulang tap tab virtual/asesmen di emulator untuk verifikasi visual penuh.

### Stabilisasi TypeScript Mobile

- Perbaikan typing dilakukan pada progress bar, input, mention input, kalender, payment screen, payment status, auth signup, dan hook exam/payment.
- Tombol upload bukti bayar cicilan administrasi diaktifkan kembali karena handler upload sudah ada tetapi blok UI sebelumnya ter-comment.
- Verifikasi: `corepack yarn tsc --noEmit --pretty false` berhasil tanpa error.
- Verifikasi: `app:assembleDevelopmentDebug` berhasil setelah cleanup TypeScript.

### Fresh Login Siswa Setelah Wipe Emulator

- Emulator `Pixel_8` sudah di-wipe data, APK `developmentDebug` di-install ulang, lalu login siswa berhasil dengan `user1@62teknologi.com` / `password`.
- Catatan input ADB: email harus diketik sebagai `user1@62teknologi.com`; input literal `user1%4062teknologi.com` ditolak validasi email mobile.
- API login host `POST /api/v1/auth/sign-in` berhasil untuk credential siswa dan mengembalikan token lokal serta data user `user 1`.
- Progress siswa terbuka dan menampilkan fase `Final Interview`; detail final interview terbuka tanpa crash.
- Drawer siswa setelah login fresh menampilkan menu Home, Training Progress, Forum, Dokumen Saya, dan Profil.
- Halaman training terbuka dan menampilkan kategori `Teori Bahasa Jepang`, `Praktik Bahasa Jepang`, serta `Soft Skill Bahasa Jepang`.
- Detail training bisa dibuka dengan tap kartu kategori `Teori Bahasa Jepang`; tab `Modul`, `Virtual Class`, dan `Kuis/Test` tampil.
- Tab `Virtual Class` dan `Kuis/Test` menampilkan data level `N4` dan `N5` sesuai counter. Level asesmen `N4` terbuka dan menampilkan kartu asesmen serta skor.
- Catatan UX: tombol `Detail` pada kartu fase training terlihat clickable, tetapi saat audit tidak membuka detail; tap kartu kategori training adalah jalur yang berhasil.
- Dokumen Saya sempat loading lebih lama, lalu daftar dokumen tampil. Nama file storage seed lokal masih terlalu panjang dan terpotong, sehingga beberapa item terlihat mirip.
- Perbaikan lanjutan: item dokumen yang sudah di-upload sekarang menampilkan label fungsional seperti `File Ijazah`, `File CV`, dan `File Paspor`; filename storage mentah dipindah ke teks kecil di bawahnya dan dipendekkan.
- Perbaikan lanjutan: list dokumen rebuild otomatis saat `userDocs` Redux selesai terisi, dan perubahan search/filter langsung memakai filter terbaru.
- Forum terbuka tanpa crash dan menampilkan empty state karena tidak ada trending post.
- Notifikasi terbuka tanpa crash dan menampilkan empty state `Belum ada notifikasi` pada tab prioritas.
- Perbaikan lanjutan: tombol `Detail` pada section training sekarang menerima handler eksplisit. Dari `TrainingScreen` dan `Progress` siswa, tombol ini diarahkan ke `DetailTrainingScreen` memakai kategori training pertama yang tersedia, sehingga tidak lagi fallback ke layar training yang sama.
- Verifikasi APK terbaru: `corepack yarn tsc --noEmit --pretty false` berhasil, build `app:assembleDevelopmentDebug` berhasil, APK berhasil di-install ke emulator, login siswa berhasil, dan Dokumen Saya menampilkan label `File Ijazah`, `File CV`, `File Paspor`, serta `File Hasil Tes Karakter`.
- Perbaikan lanjutan: komponen progress training/profile sekarang menormalisasi angka kosong atau invalid menjadi `0`, sehingga data course kosong tidak lagi menampilkan `NaN%` atau `NaN / NaN`.

## Temuan Lanjutan

- Untuk audit materi pelatihan penuh, siapkan seed user dengan `is_subscription_active = 1`, payment training completed, dan `training_program` yang sesuai dengan `course_items.program_type`.
- Log debug Redux sangat verbose di Logcat. Ini membantu audit, tapi sebaiknya dimatikan untuk build release.
- Warning Metro websocket `10.0.2.2:8081` muncul pada APK debug tanpa Metro berjalan. Ini tidak fatal selama APK punya bundled JS.
- `backend/.env` lokal saat audit menunjuk ke SQLite workspace lama. Pastikan path database disamakan sebelum handoff ke environment baru.
