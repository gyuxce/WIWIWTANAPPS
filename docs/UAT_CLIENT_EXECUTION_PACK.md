# UAT Client Execution Pack - WIWITAN Apps

Periode target: Agustus 2026
Status: **CLIENT UAT APPROVED - reported by project owner on 1 August 2026**
Related QA plan: [QA_UAT_TEST_PLAN.md](QA_UAT_TEST_PLAN.md)

Catatan administrasi: approval client sudah dilaporkan, tetapi nama reviewer, acceptance criteria, evidence per test case, dan tanda tangan/catatan resmi belum dilampirkan pada repository. Lengkapi bagian tersebut sebelum release handoff agar keputusan dapat diaudit.

## Tujuan

Dokumen ini dipakai client atau product owner untuk memvalidasi bahwa fitur aplikasi sesuai kebutuhan bisnis. UAT berbeda dari smoke test teknis: hasil UAT harus menggunakan akun, data, dan acceptance criteria yang disetujui client.

## Informasi Eksekusi

| Item | Nilai |
| --- | --- |
| Nama project | WIWITAN Apps |
| Environment UAT | `isi URL staging/API/CMS` |
| APK/AAB version | `isi versionName dan versionCode` |
| Tanggal mulai | `isi tanggal` |
| Tanggal selesai | `isi tanggal` |
| Client reviewer | `isi nama` |
| Engineering reviewer | `isi nama` |
| Device/browser | `isi device dan versi OS` |

## Data Dan Akses Yang Dibutuhkan

Client/product owner perlu menyediakan:

- Satu akun student UAT aktif.
- Satu akun admin UAT aktif.
- Data course dan module yang boleh dilihat oleh student.
- Data virtual class dan assessment.
- Minimal satu dokumen student dengan file yang dapat dibuka.
- Minimal satu topic/forum post dan notification.
- Data final interview, certification, dan payment bila flow tersebut termasuk scope UAT.
- Acceptance criteria bisnis untuk setiap flow.
- Nama reviewer yang berwenang memutuskan `Accept` atau `Reject`.

Credential production atau credential pribadi tidak boleh ditulis ke repository. Bagikan melalui channel credential yang disetujui owner project.

## Cara Eksekusi

1. Gunakan build UAT yang memiliki label version dan tanggal build.
2. Pastikan backend/CMS yang digunakan sesuai environment pada tabel Informasi Eksekusi.
3. Jalankan test case sesuai urutan atau tandai bila ada dependency.
4. Catat actual result, status, nama tester, dan waktu eksekusi.
5. Simpan screenshot atau screen recording untuk test case yang gagal, berbeda dari expected, atau membutuhkan approval.
6. Buat defect terpisah untuk setiap masalah yang ditemukan.
7. Setelah semua test case selesai, isi bagian UAT Sign-off.

## Acceptance Decision

| Keputusan | Arti |
| --- | --- |
| `Accept` | Actual result sesuai acceptance criteria dan tidak ada blocker terbuka |
| `Accept with known issue` | Flow diterima dengan defect/risiko yang disetujui tertulis |
| `Reject` | Flow belum memenuhi kebutuhan dan perlu perbaikan atau klarifikasi |
| `Blocked` | Test tidak dapat dijalankan karena environment, akun, data, atau dependency |

## UAT Test Matrix

### UAT-001 Login Dan Session

| Field | Isi |
| --- | --- |
| Skenario | Student login, credential salah, logout, relaunch |
| Preconditions | Akun student aktif dan password valid tersedia |
| Langkah | Login dengan akun valid; coba credential salah; logout; buka app kembali |
| Expected | Login valid masuk ke Home; credential salah menampilkan error; logout menghapus session; relaunch tidak blank |
| Evidence | Screenshot Home, error credential, dan landing setelah logout |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-002 Progress Dan Final Interview

| Field | Isi |
| --- | --- |
| Skenario | Melihat fase progress dan detail final interview |
| Preconditions | Data fase dan interview student sudah disiapkan |
| Langkah | Buka Progress; buka detail final interview; kembali ke Home |
| Expected | Phase, status, level, dan detail interview sesuai data client |
| Evidence | Screenshot Progress dan detail interview |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-003 Training, Module, Virtual Class, Dan Assessment

| Field | Isi |
| --- | --- |
| Skenario | Membuka course, module, material, virtual class, dan assessment |
| Preconditions | Course/module aktif dan student memiliki akses |
| Langkah | Buka Training; pilih course; buka Detail Training; buka tab Modul; buka material; cek virtual class dan assessment |
| Expected | Judul, progress, urutan module, jadwal, assessment, dan empty state sesuai acceptance criteria; tidak ada `NaN` atau data milik user lain |
| Evidence | Screenshot course, Detail Training, Modul, Virtual Class, dan Assessment |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-004 Dokumen Student

| Field | Isi |
| --- | --- |
| Skenario | Melihat, mencari, membuka, dan mengunduh dokumen |
| Preconditions | Dokumen student dan file storage tersedia |
| Langkah | Buka Dokumen; cari dokumen; buka preview/download; cek nama file panjang |
| Expected | Dokumen yang tampil hanya milik student; filename terbaca; preview/download berhasil atau error dijelaskan dengan jelas |
| Evidence | Screenshot list, preview, dan hasil download |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-005 Forum

| Field | Isi |
| --- | --- |
| Skenario | Melihat topic, mencari post, membuka detail, dan menjalankan posting/comment bila termasuk scope |
| Preconditions | Topic dan data forum tersedia; aturan moderasi disepakati |
| Langkah | Buka Forum; gunakan search/sort; buka detail; lakukan post/comment sesuai permission |
| Expected | Topic, body, author, comment, moderation message, dan empty state sesuai kebutuhan bisnis |
| Evidence | Screenshot list, detail, dan hasil post/comment bila dijalankan |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-006 Notification

| Field | Isi |
| --- | --- |
| Skenario | Melihat notification list, badge, tab, dan detail |
| Preconditions | Notification target student sudah dibuat |
| Langkah | Buka Notification; cek badge; buka item; tandai/read sesuai flow |
| Expected | Notification yang relevan tampil pada user yang benar dan status baca tersimpan sesuai kebutuhan |
| Evidence | Screenshot badge, list, dan detail |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-007 Admin Content Management

| Field | Isi |
| --- | --- |
| Skenario | Admin membuat atau mengubah course, module, item, virtual class, assessment, forum, dan notification |
| Preconditions | Akun admin UAT dan permission sesuai tersedia |
| Langkah | Login CMS; buka menu content; buat/edit data uji; simpan; cek hasil pada mobile bila termasuk scope |
| Expected | Validasi field bekerja; data tersimpan; permission sesuai; perubahan yang dipublish muncul di mobile sesuai jadwal/status |
| Evidence | Screenshot form, hasil simpan, dan mobile result |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-008 User Dan Role Management

| Field | Isi |
| --- | --- |
| Skenario | Admin melihat user, membuat user, membuat role, dan mengatur permission |
| Preconditions | Akun admin dan role test tersedia |
| Langkah | Buka Management Admin; cek user; buat/edit role test; login dengan role non-admin bila disediakan |
| Expected | User/role tersimpan; menu terlarang tidak tampil atau tidak dapat diakses; perubahan permission konsisten |
| Evidence | Screenshot user list, role permission, dan access boundary |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-009 Bahasa Dan Data Bilingual

| Field | Isi |
| --- | --- |
| Skenario | Memeriksa label aplikasi dan title data dalam bahasa Indonesia/Jepang |
| Preconditions | Data bilingual yang disepakati client sudah tersedia |
| Langkah | Buka Home, Progress, Training, Detail Training, Forum, dan Notification; cek perubahan bahasa serta title dari backend |
| Expected | Label dan title tidak mojibake, tidak overlap, dan tidak tercampur secara merusak |
| Evidence | Screenshot layar dalam bahasa yang diuji |
| Actual result | `isi oleh tester` |
| Decision | `Accept / Accept with known issue / Reject / Blocked` |

### UAT-010 Persetujuan Akhir

| Field | Isi |
| --- | --- |
| Skenario | Client menyetujui hasil UAT dan known issue |
| Preconditions | Semua test case prioritas sudah memiliki keputusan |
| Langkah | Review defect log, risiko, workaround, dan release scope |
| Expected | Client memberi keputusan akhir tertulis untuk internal testing atau meminta perbaikan tambahan |
| Evidence | Approval tertulis, meeting notes, atau sign-off dokumen |
| Actual result | `Client UAT dilaporkan approved oleh project owner pada 1 Agustus 2026; detail evidence dan sign-off formal belum dilampirkan` |
| Decision | `Accept - approval reported; formal sign-off pending` |

## UAT Defect Log

| ID | Test case | Severity | Actual result | Evidence/link | Owner | Decision/status |
| --- | --- | --- | --- | --- | --- | --- |
| UAT-DEF-001 | `isi` | P0/P1/P2/P3 | `isi` | `isi` | `Engineering/Client` | Open/Fixed/Retest/Accepted |

Severity guide:

- P0: aplikasi tidak dapat dipakai, data hilang, atau security blocker.
- P1: fitur core gagal tanpa workaround yang layak.
- P2: fitur penting bermasalah tetapi masih ada workaround.
- P3: visual, copy, atau edge case minor.

## UAT Sign-off

| Role | Nama | Keputusan | Tanggal | Tanda tangan/catatan |
| --- | --- | --- | --- | --- |
| Client/Product Owner | `isi` | Accept / Reject | `isi` | `isi` |
| Client Reviewer | `isi` | Accept / Reject | `isi` | `isi` |
| Engineering Lead | `isi` | Accept / Reject | `isi` | `isi` |

## Release Handoff Setelah UAT

UAT `Accept` tidak otomatis berarti production release. Setelah UAT diterima, engineering masih perlu memastikan:

- Semua P0/P1 sudah ditutup atau memiliki waiver tertulis.
- Backend production/staging stabil.
- Firebase, storage, payment, dan push notification tervalidasi.
- Keystore dan credential signing aman.
- AAB production berhasil dibuild.
- Release smoke test selesai.
- Privacy policy, Data Safety, store listing, dan reviewer access siap.
