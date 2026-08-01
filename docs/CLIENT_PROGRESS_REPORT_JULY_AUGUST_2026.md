# Client Progress Report - WIWITAN Apps

Periode laporan: 16 Juli 2026 - 1 Agustus 2026  
Status dokumen: Report engineering untuk client/product owner  
Repository: `https://github.com/gyuxce/WIWIWTANAPPS`

## Ringkasan Eksekutif

Selama Juli, pekerjaan berfokus pada mengambil alih source handoff, membuat environment lokal dapat dijalankan, memahami struktur CMS/backend/mobile, serta memperbaiki bug pada flow utama siswa. Pada awal Agustus, project sudah masuk **Stage 6 - Formal QA & UAT**.

Per 1 Agustus 2026:

| Indikator | Estimasi | Keterangan |
| --- | ---: | --- |
| Kesiapan menuju internal release candidate | **60-65%** | Core mobile flow sudah dapat dijalankan dan diaudit di emulator |
| Kesiapan menuju Google Play production | **45-50%** | Production environment, UAT, signing final, Firebase, storage, payment, dan Play Console masih perlu diselesaikan |
| QA/UAT formal | **40%** | Test plan, environment gate, smoke, dan negative mobile batch 1 sudah tersedia |
| Google Play release preparation | **25%** | Checklist dan dasar signing sudah ada; AAB production dan akses production belum divalidasi |

Persentase di atas adalah estimasi kesiapan berbasis gate project, bukan jumlah baris kode atau jumlah commit.

## Pekerjaan Bulan Juli

### 1. Recovery Source Dan Repository

Pekerjaan yang dilakukan:

- Source handoff developer sebelumnya diimpor dan dirapikan ke repository private.
- Struktur monorepo dipetakan menjadi `mobile/`, `backend/`, `cms/`, dan `docs/`.
- File secret, credential, build artifact, serta file audit lokal dicegah masuk Git.
- README, setup checklist, struktur project, kebutuhan secret, dan dokumentasi handoff dibuat.
- Riwayat keputusan teknis mulai dicatat di `docs/`.

Hasil:

- Repository private dapat digunakan sebagai sumber kerja bersama.
- Developer berikutnya memiliki peta folder dan instruksi setup yang lebih jelas.

### 2. Backend Dan CMS Lokal

Pekerjaan yang dilakukan:

- Backend Laravel dijalankan dengan database SQLite lokal dan local auth fallback.
- Migration, seed, akun admin, dan akun siswa lokal diverifikasi.
- CMS dapat dijalankan dan login admin lokal.
- Route CMS dan flow admin dasar diaudit.
- Menu user, role, training, seminar, forum, notification, setting, dan dashboard ditinjau.
- Dokumentasi CMS audit dibuat untuk membedakan fitur yang sudah ada dan fitur yang masih membutuhkan data/validasi client.

Hasil:

- Admin dapat masuk ke CMS lokal.
- Data user dan role dapat digunakan untuk audit awal.
- CMS siap dipakai untuk pengujian lokal, tetapi belum dapat dianggap sebagai environment production.

### 3. Setup Android Dan Mobile Development

Pekerjaan yang dilakukan:

- Android Studio, Android SDK API 35, Platform Tools, emulator Pixel/API 35, JDK, dan environment Android disiapkan.
- Helper setup environment Android untuk Windows dibuat/didokumentasikan.
- APK development/QA berhasil dibuild dan diinstall ke emulator.
- APK QA dapat mengakses backend lokal emulator melalui `10.0.2.2`.
- TypeScript mobile berhasil melewati pemeriksaan tanpa error.

Hasil:

- Aplikasi Android dapat dijalankan untuk audit teknis.
- Emulator `Wiwitan_API35_Lite` digunakan sebagai baseline QA lokal.
- APK yang digunakan masih debug/QA dan belum merupakan APK/AAB production.

### 4. Audit Dan Stabilisasi Layar Siswa

Layar dan flow yang diaudit:

- Login dan session siswa.
- Home dan drawer navigation.
- Progress dan final interview.
- Training category dan detail training.
- Modul, materi, virtual class, dan assessment.
- Dokumen siswa.
- Forum dan detail forum.
- Notification.
- Profile dan logout.
- Background, relaunch, serta session recovery.

Perbaikan penting:

- Login mobile membaca response/error API dengan benar.
- Session recovery ditambahkan untuk access token yang expired.
- Blank screen/logout setelah relaunch ditangani.
- Progress training `NaN%` dan `NaN / NaN` diperbaiki.
- Mismatch progress detail training diperbaiki.
- Header detail training saat data kosong menampilkan `0 / 0`.
- Tombol detail training dan label filename dokumen diperbaiki.
- Filename panjang diberi fallback agar tidak merusak layout.
- Handling media dan empty state diperkuat.

### 5. i18n Dan Data Bilingual

Pekerjaan yang dilakukan:

- Mojibake/encoding diaudit dan script checker dibuat.
- Label statis mobile yang penting dirapikan.
- `title_japan` untuk course category diisi pada seed lokal.
- Course item/module mulai membaca `title_japan` dari backend dan menampilkannya di mobile.
- Sumber data i18n backend/CMS dipetakan.

Yang masih tersisa:

- Forum topic bilingual.
- Body/topic notification dari backend.
- Validasi data bilingual pada environment production-like.

### 6. Release Groundwork

Pekerjaan yang dilakukan:

- Checklist Google Play dibuat.
- Dasar release signing dan kebutuhan keystore didokumentasikan.
- Credential signing diarahkan untuk disimpan di local machine atau secret manager, bukan repository.
- Perbedaan build QA dan build production dicatat.

Yang belum selesai:

- Keystore production final.
- AAB production yang berhasil dibuild dan diverifikasi.
- Firebase production configuration.
- Play Console dan store listing.
- Privacy policy dan Data Safety form.
- Backend, storage, payment, dan notification production.

## Checkpoint Awal Agustus

### Formal QA Dan Negative Test

Pada 1 Agustus, QA formal batch awal dan negative mobile batch 1 dijalankan pada emulator lokal.

Hasil yang lulus:

- Credential salah: error tampil dan aplikasi tidak masuk Home.
- Logout: session dibersihkan dan aplikasi kembali ke landing/login.
- Backend/API tidak tersedia: `Network request failed` tampil tanpa crash.
- Access token benar-benar expired dengan refresh token valid: token baru tersimpan dan aplikasi kembali ke Progress.
- Access token dan refresh token invalid: session dihapus dan user kembali ke landing.
- Student mencoba endpoint CMS/admin: HTTP 401.
- Student membuka profile sendiri: HTTP 200.
- Background/resume dan rotasi device: aplikasi kembali tanpa crash atau kehilangan session.
- Permission Kalender ditolak: aplikasi tetap dapat digunakan.

Catatan QA:

- `QA-NEG-004` null/incomplete data masih pending.
- `QA-NEG-005` network lambat masih pending.
- `QA-NEG-006` double tap submit masih pending.
- Toast generik `Error internal server` masih muncul transient pada sebagian startup/recovery dan dicatat sebagai defect P2 untuk diisolasi.
- Mobile Jest legacy masih menjadi blocker test infrastructure karena membutuhkan mock native SDK yang luas; hal ini berbeda dari runtime APK yang sudah dapat berjalan.

## Perbandingan Progres Juli Dan Agustus

Angka berikut diambil dari checkpoint project yang sudah dicatat pada 22 Juli dan 1 Agustus. Angka tidak boleh dijumlahkan menjadi 100% karena setiap baris adalah gate yang berbeda.

| Area | Checkpoint 22 Juli | Checkpoint 1 Agustus | Perubahan |
| --- | ---: | ---: | --- |
| Internal release candidate | 60-65% | 60-65% | Core flow tetap pada level yang sama; stabilisasi dan QA menurunkan risiko, bukan menambah fitur besar |
| Google Play production readiness | 45-50% | 45-50% | Masih menunggu akses dan validasi production |
| QA/UAT formal | 25% | 40% | Naik karena formal test plan, environment gates, smoke, dan negative mobile batch 1 sudah dijalankan |
| Google Play release preparation | 20% | 25% | Naik karena checklist dan dasar signing sudah dirapikan |
| Mobile core flow | Audit sedang berjalan | Core flow dan recovery utama sudah lulus smoke/QA lokal | Progress kualitatif meningkat |
| Data/i18n | Course category mulai diverifikasi | Course item/module title Jepang sudah terhubung; forum/notification masih pending | Scope bilingual bertambah |

Interpretasi untuk client: project tidak berhenti selama Juli. Sebagian besar pekerjaan Juli adalah pekerjaan fondasi dan stabilisasi yang membuat project dapat diuji. Pada awal Agustus, fokus bergeser dari menemukan cara menjalankan aplikasi menjadi membuktikan aplikasi melalui QA/UAT dan menyiapkan jalur release.

## Posisi Stage Saat Ini

| Stage | Nama | Status |
| --- | --- | --- |
| 1 | Repo recovery dan cleanup | Selesai |
| 2 | Local backend/CMS/mobile setup | Selesai untuk local development |
| 3 | Audit CMS dan admin dasar | Sebagian besar selesai; validasi bisnis client masih diperlukan |
| 4 | Mobile student stabilization | Core flow, bug utama, dan session recovery sudah stabil di QA lokal |
| 5 | Data/i18n/backend hardening | Sebagian selesai; forum dan notification dynamic data masih pending |
| 6 | Formal QA dan UAT | QA batch 1 dan negative mobile batch 1 selesai; UAT client belum dimulai |
| 7 | Release preparation Google Play | Mulai, tetapi belum siap publish production |

## Next Action Agustus

### Prioritas 1: Mulai UAT Client

UAT client adalah langkah berikutnya yang paling tepat untuk validasi bisnis. UAT perlu memakai akun dan data yang disepakati client, bukan hanya seed lokal.

Yang perlu disiapkan:

- Acceptance criteria per flow.
- Akun student dan admin untuk pengujian.
- Data course/module, virtual class, assessment, dokumen, forum, notification, payment, dan interview.
- Nama reviewer dari client/product owner.
- Keputusan `Accept`, `Reject`, atau `Accept with known issue` untuk setiap flow.
- Screenshot atau rekaman singkat sebagai evidence.

Flow UAT prioritas:

1. Login, logout, dan session recovery.
2. Home, progress, final interview, dan drawer.
3. Training, module, virtual class, dan assessment.
4. Dokumen siswa.
5. Forum dan notification.
6. Profile, language, certification, dan payment.
7. CMS user/role dan content management.

### Prioritas 2: Tutup QA Gate Yang Tersisa

- Pastikan migration dan seed dapat diulang dari database kosong.
- Jalankan fixture null/incomplete data.
- Jalankan network shaping untuk koneksi lambat.
- Uji double tap pada form yang membuat record, dengan test data khusus.
- Isolasi endpoint pemicu toast `Error internal server`.
- Putuskan apakah test Jest legacy akan diperbaiki atau diberi waiver dengan bukti runtime QA.

### Prioritas 3: Release Preparation Paralel

Release preparation dapat dimulai sekarang, tetapi upload production sebaiknya menunggu UAT dan production validation.

Action yang perlu dikerjakan:

- Kumpulkan akses Google Play Console.
- Kumpulkan akses Firebase production.
- Pastikan domain API/CMS production atau staging tersedia.
- Validasi storage/media production.
- Validasi payment pada sandbox/staging.
- Finalisasi package name, version name, version code, icon, dan splash asset.
- Amankan keystore/signing credential.
- Build `productionRelease` AAB.
- Install dan smoke test build release.
- Siapkan privacy policy, Data Safety, content rating, screenshot, feature graphic, dan reviewer account.

## Ketergantungan Dari Client/Owner

Pekerjaan berikut tidak dapat ditutup hanya dari source code lokal:

| Kebutuhan | Mengapa dibutuhkan |
| --- | --- |
| Acceptance criteria dan reviewer UAT | Untuk menetapkan apakah fitur diterima secara bisnis |
| Akun/data staging | Untuk menguji hasil yang sesuai kondisi bisnis sebenarnya |
| Backend/API production-like | Untuk memvalidasi response, auth, dan permission di luar seed lokal |
| Firebase production | Untuk login sosial dan push notification |
| Storage/media bucket | Untuk gambar, video, audio, dan dokumen |
| Payment sandbox/production | Untuk transaksi dan status pembayaran |
| Google Play Console | Untuk internal testing dan publish |
| Privacy policy dan data safety information | Wajib untuk proses release Google Play |
| App asset final | Dibutuhkan untuk store listing dan review |

## Estimasi Timeline

Timeline ini bergantung pada akses client dan hasil UAT.

| Target | Estimasi | Syarat utama |
| --- | --- | --- |
| UAT client mulai | Minggu pertama Agustus | Akun, data, criteria, dan reviewer tersedia |
| APK internal untuk review client | 3-5 hari kerja setelah scope UAT disepakati | Build QA berlabel dan evidence smoke lengkap |
| Release candidate staging | 1-2 minggu | Staging production-like, media, notification, dan payment tersedia |
| Google Play internal testing | 2-3 minggu | Keystore, Firebase, AAB production, Play Console, dan UAT approve |
| Google Play production | 3-5 minggu | Semua release gate selesai dan review Google Play lolos |

## Kesimpulan Untuk Client

Project sudah melewati fase recovery source, setup environment, audit CMS, setup Android, stabilisasi mobile, perbaikan bug utama, dan QA teknis awal. Per 1 Agustus, aplikasi sudah siap masuk **UAT client**, tetapi belum siap dipublish ke Google Play production.

Keputusan dan action paling penting bulan Agustus adalah menjalankan UAT dengan data client, menutup defect/blocker yang ditemukan, lalu melakukan release preparation secara paralel sampai AAB production dan environment production tervalidasi.

Dokumen pendukung:

- [Project status report](PROJECT_STATUS_REPORT.md)
- [Formal QA/UAT test plan](QA_UAT_TEST_PLAN.md)
- [Google Play release checklist](GOOGLE_PLAY_RELEASE_CHECKLIST.md)
