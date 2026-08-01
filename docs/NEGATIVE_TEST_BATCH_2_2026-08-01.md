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
| QA-NEG-004 | Data backend null/incomplete | Fixture null/incomplete direplay melalui proxy ke emulator; Detail Training tetap usable tanpa `NaN`, blank, atau crash | `PASS-QA` |
| QA-NEG-005 | Network lambat | Delayed proxy 2.5 detik menunjukkan loading overlay, data pulih setelah respons, tanpa `NaN` atau crash | `PASS-QA` |
| QA-NEG-006 | Double tap submit | Dua tap cepat pada UI menghasilkan satu record; fixture dibersihkan | `PASS-QA` |

## QA-NEG-004 - Null/Incomplete Data

### Pemeriksaan

- `SectionLesson` mengubah count yang `null`, kosong, atau bukan angka menjadi `0`.
- `CardProgressLesson` dan `CardProgressProfile` mencegah pembagian dengan total `0`, sehingga tidak menghasilkan `NaN`.
- `DetailTrainingScreen` memakai empty array ketika `classVirtual` atau `assesment` tidak tersedia.
- Cover course yang null atau tidak memiliki URL memakai gambar fallback.
- Mobile TypeScript lulus dengan `corepack yarn tsc --noEmit --pretty false`.
- APK QA terbaru ter-install dan `MainActivity` resumed tanpa `AndroidRuntime` fatal error.

### Replay fixture ke emulator

- `scripts/qa-http-proxy.mjs` dijalankan pada port `8888` dengan mode `null`, upstream ke backend lokal `127.0.0.1:8000`.
- Proxy memaksa field numerik progress dan cover menjadi `null`, serta `classVirtual` dan `assesment` menjadi `null` pada endpoint training yang relevan.
- Emulator diarahkan ke `10.0.2.2:8888`, lalu layar Training dan Detail Training dibuka.
- Endpoint yang terintersep mengembalikan `200` dengan marker `fixture=null-incomplete`.

### Hasil

- Kartu course menampilkan `0%` dan `0 / 0`, bukan `NaN%` atau `NaN / NaN`.
- Detail Training tetap menampilkan header, progress card, tab `0/0`, dan level card dengan fallback cover.
- Empty array/null guard berjalan untuk virtual class dan assessment.
- Logcat emulator tidak menemukan `FATAL EXCEPTION`.

Keputusan: `PASS-QA` untuk payload null/incomplete pada alur Training dan Detail Training.

## QA-NEG-005 - Network Lambat

### Setup dan hasil

- `scripts/qa-http-proxy.mjs` dijalankan pada port `8889` dengan mode `delay` dan `QA_PROXY_DELAY_MS=2500`.
- Emulator diarahkan ke `10.0.2.2:8889` saat Detail Training dibuka.
- Loading overlay transparan dan spinner terlihat selama request training tertunda.
- Setelah respons selesai, overlay hilang dan data kembali tampil normal: progress `20%`, `4 / 20`, tab `0/12`, `4/4`, dan `0/4`.
- Tidak ditemukan `NaN`, blank state permanen, atau `FATAL EXCEPTION`.
- Tidak ada duplicate record; request GET yang terlihat pada proxy adalah request pembacaan data training dan tidak membuat perubahan data.

Keputusan: `PASS-QA` untuk latency 2.5 detik pada Detail Training. Timeout/error network dan retry destructive tetap menjadi cakupan lanjutan bila environment staging tersedia.

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
- Pada Forum Editor, judul, deskripsi, dan topic `Teori Bahasa Jepang` diisi. Tombol `下書きに保存` dan `セーブ` masing-masing ditekan dua kali cepat.
- Screenshot 150 ms pada kedua jalur menunjukkan loading state. Jalur draft menampilkan satu modal `投稿が下書きに正常に追加されました`; jalur publish menampilkan satu modal `投稿は正常に作成されました`.
- Query database untuk marker draft dan publish masing-masing menghasilkan `1` record. Setelah cleanup exact marker, kedua query kembali `0`.
- Logcat tidak menemukan `FATAL EXCEPTION` pada proses aplikasi.

Keputusan: `PASS-QA` untuk double-tap pada jalur draft dan publish UI mobile. Reproduction dua request langsung ke API tetap menjadi rekomendasi hardening backend berupa idempotency key atau duplicate protection, tetapi tidak menggagalkan guard UI yang diuji pada batch ini.

## File Yang Berubah

- `mobile/src/screens/ForumEditorScreen/ForumEditorScreen.tsx`
- `mobile/src/screens/TrainingScreen/DetailTrainingScreen/index.tsx`
- `mobile/src/components/SectionLesson/index.tsx`
- `mobile/src/screens/TrainingScreen/DetailTrainingScreen/styles.ts`
- `scripts/qa-http-proxy.mjs`

## Next Action

1. Lampirkan screenshot/log proxy sebagai evidence batch 2 pada artefact QA bila dibutuhkan client.
2. DEF-001 sudah ditutup melalui Jest test-only harness: `2` suites / `4` tests passed.
3. DEF-002 sudah ditutup melalui guard HTTP `401` pada `useExam` dan expired-access replay pada APK baru tanpa internal-server error/fatal.
4. Lanjutkan formal UAT sign-off, release hardening, signing keystore, dan build AAB production.
