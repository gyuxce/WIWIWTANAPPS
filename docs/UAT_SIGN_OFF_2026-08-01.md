# Formal UAT Sign-off - WIWITAN Apps

Tanggal dokumen: 1 Agustus 2026
Status administratif: **Siap untuk dilengkapi dan ditandatangani client/product owner**
Related QA plan: [QA_UAT_TEST_PLAN.md](QA_UAT_TEST_PLAN.md)
Internal evidence: [INTERNAL_UAT_REPORT_2026-08-01.md](INTERNAL_UAT_REPORT_2026-08-01.md)
Execution pack: [UAT_CLIENT_EXECUTION_PACK.md](UAT_CLIENT_EXECUTION_PACK.md)

## 1. Tujuan Dokumen

Dokumen ini menjadi lembar keputusan formal setelah client/product owner menyelesaikan atau mengonfirmasi UAT. Project owner melaporkan bahwa client UAT sudah **Approved pada 1 Agustus 2026**. Nama reviewer, evidence per test case, acceptance criteria bisnis, dan tanda tangan belum diberikan, sehingga bagian tersebut harus dilengkapi sebelum dokumen dianggap sebagai sign-off final.

`Approved` pada dokumen ini berarti keputusan yang dilaporkan oleh project owner. Dokumen belum boleh diperlakukan sebagai bukti tanda tangan sampai kolom approval dan evidence diisi oleh pihak yang berwenang.

## 2. Identitas UAT

| Field | Isi |
| --- | --- |
| Project | WIWITAN Apps |
| Scope | Aplikasi Android siswa dan CMS/admin sesuai flow yang disepakati |
| Environment | `isi URL/API/CMS UAT atau staging` |
| APK/AAB | `isi versionName, versionCode, dan checksum bila tersedia` |
| Periode | `isi tanggal mulai - tanggal selesai` |
| Client/Product Owner | `isi nama` |
| Client Reviewer | `isi nama` |
| Engineering Reviewer | `isi nama` |
| Device/OS | `isi device dan versi Android` |

## 3. Scope Dan Acceptance Summary

| ID | Area | Hasil internal terbaru | Keputusan client | Evidence client |
| --- | --- | --- | --- | --- |
| UAT-001 | Login dan session siswa | PASS-QA; invalid credential, logout, relaunch, dan session recovery diuji | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-002 | Home dan progress | PASS-SMOKE; data progress dan final interview terbuka | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-003 | Training, module, virtual class, assessment | PASS-SMOKE; zero state tidak menghasilkan `NaN` | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-004 | Dokumen siswa | PASS-SMOKE; filename panjang dan empty state diaudit | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-005 | Forum | PASS-SMOKE; list/detail dan double-submit mobile diuji | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-006 | Notifikasi | PASS-SMOKE; tab/list/detail dibuka | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |
| UAT-007 | CMS content management | PASS-SMOKE parsial; CRUD lengkap dan publish perlu data UAT client | `Accept / Reject / Accept with known issue / Blocked` | `isi screenshot/recording` |
| UAT-008 | User, role, dan permission | PASS-SMOKE parsial; matrix permission perlu akun UAT | `Accept / Reject / Accept with known issue / Blocked` | `isi screenshot/recording` |
| UAT-009 | Bahasa dan data bilingual | PASS-QA untuk course/category/module yang diuji; data forum/notifikasi masih perlu konfirmasi scope | `Accept / Reject / Accept with known issue` | `isi screenshot/recording` |

Catatan: hasil internal di atas bukan pengganti actual result dari client. Client tetap perlu mengisi keputusan dan evidence berdasarkan akun, data, dan environment yang disepakati.

## 4. Defect And Release Log

| ID | Severity | Ringkasan | Root cause/perbaikan | Evidence terbaru | Status UAT/release |
| --- | --- | --- | --- | --- | --- |
| DEF-001 | P2 | Jest legacy tidak dapat menjalankan `App-test.tsx` karena mock native SDK belum lengkap | Jest harness ditambah dengan mock test-only untuk native dependency, asset mapper, dan async `act` | `2` suites, `4` tests passed; `tsc --noEmit` passed | **Closed - PASS-QA** |
| DEF-002 | P2 | Toast `Error internal server` muncul transient saat access token expired dan recovery berjalan | `useExam` tidak lagi memetakan HTTP `401` recovery sebagai error `500`; numeric error lain tetap dipertahankan | Expired-access replay pada APK baru: refresh menghasilkan access token baru; `Error internal server=0`, `FATAL EXCEPTION=0` | **Closed - PASS-QA; client confirmation pending** |
| DEF-003 | P1 | Double tap forum sempat membuat dua request/record sebelum guard | Synchronous submit lock, loading state, dan recovery invalid response | Dua tap cepat draft/publish menghasilkan satu record; fixture dibersihkan | **Closed - PASS-QA** |
| QA-NEG-004 | P1 | Null/incomplete payload dapat memicu data kosong | Null guard dan empty-state handling pada training | Fixture proxy: `0%`/`0 / 0`, tanpa `NaN`/crash | **Closed - PASS-QA** |
| QA-NEG-005 | P2 | Network lambat perlu loading state yang jelas | Delayed proxy dan loading overlay Detail Training | Delay 2.5 detik pulih ke `20%` dan `4 / 20`, tanpa crash | **Closed - PASS-QA** |
| REL-001 | P0 | AAB production belum dapat ditandatangani | Keystore upload dan `MYAPP_UPLOAD_*` belum tersedia | Preflight R8 lulus, task berhenti pada signing | **Open - release blocker** |

## 5. Known Issues Dan Batasan Yang Harus Disetujui

- Pengujian internal memakai backend/CMS lokal dan data seed, bukan production client.
- Device fisik, push notification production, media storage production, payment production, dan Play Console belum menjadi bukti release.
- AAB production belum tersedia karena signing key/credential belum diberikan atau dibuat dengan persetujuan owner.
- Data bilingual forum topic dan body notification belum menjadi scope implementasi penuh.

Client memilih salah satu:

- `Accept` - semua acceptance criteria scope UAT terpenuhi dan known issue tidak menghalangi handoff.
- `Accept with known issue` - issue/batasan di atas diterima secara tertulis dengan owner dan target tindak lanjut.
- `Reject` - perlu perbaikan sebelum UAT diterima.

## 6. Keputusan Formal

| Field | Isi |
| --- | --- |
| Keputusan client | `Accept / Accept with known issue / Reject` |
| Scope yang diterima | `isi UAT-001 s.d. UAT-009 atau tulis pengecualian` |
| Defect yang diterima/di-waive | `isi ID defect bila ada` |
| Syarat release lanjutan | `isi, misalnya signing, staging, atau Play Console` |
| Catatan client | `isi` |

## 7. Approval

| Peran | Nama | Keputusan | Tanggal | Tanda tangan/konfirmasi |
| --- | --- | --- | --- | --- |
| Client/Product Owner | `isi nama` | `Accept / Reject` | `isi` | `isi` |
| Client Reviewer | `isi nama` | `Accept / Reject` | `isi` | `isi` |
| Engineering Lead | `isi nama` | `Accept / Reject` | `isi` | `isi` |

### Bukti Approval

Lampirkan salah satu atau beberapa bukti berikut pada folder/project handoff:

- Email atau chat approval dari reviewer berwenang.
- Meeting notes yang mencantumkan scope, keputusan, known issue, dan tanggal.
- Screenshot/signature pada dokumen ini.
- Link evidence UAT yang dapat diakses reviewer.

Jangan menaruh credential, token, keystore, atau data pribadi yang tidak diperlukan ke repository.
