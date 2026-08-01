# Negative Test Batch 2 - WIWITAN Apps

Tanggal: 1 Agustus 2026
Environment: backend local, SQLite local, AVD `Wiwitan_API35_Lite`, package QA `com.wiwitanbaru.wiwitan.dev`

## Tujuan

Batch ini memeriksa tiga kondisi yang belum selesai dari negative QA batch 1:

- data backend null atau tidak lengkap;
- jaringan lambat;
- double tap pada submit forum.

Hasil di bawah adalah QA internal. Ini bukan sign-off client dan bukan validasi production.

## Ringkasan

| ID | Skenario | Hasil | Keputusan |
| --- | --- | --- | --- |
| QA-NEG-004 | Data backend null/incomplete | Guard source dan build diverifikasi; replay payload malformed belum dilakukan | `PARTIAL` |
| QA-NEG-005 | Network lambat | Belum dapat dijalankan tanpa network shaping yang aman/reproducible | `BLOCKED` |
| QA-NEG-006 | Double tap submit | Dua request paralel membuat dua record; guard mobile diperbaiki | `FIXED-PENDING-RETEST` |

## QA-NEG-004 - Null/Incomplete Data

### Pemeriksaan

- `SectionLesson` mengubah count yang `null`, kosong, atau bukan angka menjadi `0`.
- `CardProgressLesson` dan `CardProgressProfile` mencegah pembagian dengan total `0`, sehingga tidak menghasilkan `NaN`.
- `DetailTrainingScreen` memakai empty array ketika `classVirtual` atau `assesment` tidak tersedia.
- Cover course yang null atau tidak memiliki URL memakai gambar fallback.
- Mobile TypeScript lulus dengan `corepack yarn tsc --noEmit --pretty false`.
- APK QA terbaru ter-install dan `MainActivity` resumed tanpa `AndroidRuntime` fatal error.

### Batasan

Belum ada proxy atau fixture API yang memaksa payload malformed masuk ke emulator saat layar Detail Training dibuka. Karena itu status tetap `PARTIAL`, bukan `PASS-QA` penuh.

## QA-NEG-005 - Network Lambat

Status `BLOCKED` untuk batch ini. Network shaping yang terkontrol belum tersedia pada environment Windows/AVD ini. Test API tidak tersedia pada batch 1 sudah lulus, tetapi itu tidak sama dengan latency test.

Acceptance criteria yang masih harus dibuktikan:

- loading indicator terlihat selama request lambat;
- tidak ada request atau record ganda;
- timeout menampilkan error yang dapat dipahami;
- retry tidak merusak state sebelumnya.

## QA-NEG-006 - Double Tap Submit

### Reproduction sebelum fix

Fixture aman memakai post forum draft dengan judul marker unik. Dua `POST /api/v1/mobile/forum/posts` dikirim hampir bersamaan menggunakan akun student lokal.

| Evidence | Actual result |
| --- | --- |
| Request 1 | HTTP `201 Created` |
| Request 2 | HTTP `201 Created` |
| Matching record sebelum cleanup | `2` |
| Matching record setelah cleanup | `0` |

Kesimpulan: API lokal belum mempunyai idempotency key atau duplicate protection. Tanpa guard di client, double tap dapat membuat dua record.

### Fix mobile

`mobile/src/screens/ForumEditorScreen/ForumEditorScreen.tsx` sekarang:

- memakai `useRef` sebagai synchronous submit lock;
- menolak submit berikutnya ketika request pertama masih berjalan;
- mengirim `isLoading` ke tombol publish dan draft;
- melepaskan lock setelah modal hasil tampil atau ketika request/error selesai;
- menangani JSON editor invalid dan rejection request agar loading tidak macet.

### Verifikasi setelah fix

- TypeScript mobile lulus.
- APK `developmentQa` berhasil dibuat setelah bundling native selesai.
- APK berhasil di-install ke emulator.
- `MainActivity` resumed dan tidak ada fatal Android runtime log.

Full manual double-tap pada layar forum masih perlu satu retest UI dengan APK terbaru. Status defect karena itu `FIXED-PENDING-RETEST`, bukan closed final.

## File Yang Berubah

- `mobile/src/screens/ForumEditorScreen/ForumEditorScreen.tsx`
- `mobile/src/screens/TrainingScreen/DetailTrainingScreen/index.tsx`
- `mobile/src/components/SectionLesson/index.tsx`

## Next Action

1. Jalankan manual replay null/incomplete pada Detail Training dengan proxy/fixture response yang dikontrol.
2. Siapkan network shaping atau delayed proxy untuk QA-NEG-005.
3. Buka Forum Editor pada APK terbaru dan lakukan double tap publish/draft; pastikan hanya satu modal sukses dan satu record.
4. Setelah tiga item selesai, ulangi formal QA P1 dan lanjutkan UAT client.
