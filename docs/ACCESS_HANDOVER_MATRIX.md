# Access Handover Matrix - WIWITAN Apps

Tanggal update: 2 Agustus 2026

Dokumen ini menjadi daftar tunggal untuk handover akses dari project owner dan
developer sebelumnya. Akses production harus diberikan melalui invitation dan
role resmi ke akun kerja, bukan dengan mengirim password atau token melalui
chat.

## Prinsip Kepemilikan

- Wiwitan tetap menjadi owner utama untuk akun dan layanan production.
- Akun kantor developer menjadi akun operator/admin yang ditambahkan ke layanan.
- Credential, recovery code, keystore, dan token disimpan di password manager
  atau secret manager yang disepakati; jangan commit ke repository.
- Setiap akses dicatat bersama owner, role, tanggal diterima, tanggal review,
  dan bukti handover.
- Akses developer sebelumnya dicabut atau dirotasi setelah handover selesai.

## Matrix Akses

| Area | Status | Owner yang dikonfirmasi | Akses/bukti yang dibutuhkan | PIC handover | Catatan |
| --- | --- | --- | --- | --- | --- |
| Source repository | BLOCKED - SECURITY CLEANUP | Wiwitan | Tiga project GitLab private sudah berisi source: Backend Laravel, CMS React JS, dan Mobile React Native | Pak Azani + Citta | Baseline source masuk, tetapi Backend men-track Firebase Admin service-account JSON; rotasi key dan pembersihan repository wajib sebelum release handover |
| Backend/server | MENUNGGU AKSES | Wiwitan | Hosting/cloud, SSH atau panel, staging/production URL, deployment method, runtime version | Pak Azani | Jangan meminta password lewat chat; gunakan user/invitation atau channel aman |
| Database | MENUNGGU AKSES | Wiwitan | Staging DB atau dump, production migration procedure, backup/restore, DB host/user | Citta + Pak Azani | Fresh SQLite local migration/seed sudah PASS-QA; production belum diverifikasi |
| Storage Sardine | MENUNGGU ENDPOINT | Wiwitan | Approved staging/production endpoint, auth contract, bucket/folder, credential, retention/cleanup policy | Pak Azani + Citta | Local adapter upload/readback sudah PASS-QA; `CMS-DEF-009` masih terbuka |
| Firebase | ROTATE BEFORE USE | Wiwitan | Firebase Project Owner/Admin, `google-services.json`, FCM config, service account procedure | Citta + Pak Azani | Service-account key ditemukan di source baseline; disable/delete key lama setelah pengganti aman tersedia, lalu hapus file dari branch dan audit history |
| Google Play Console | MENUNGGU INVITE | Wiwitan | Account Owner/Admin, package `com.wiwitanbaru.wiwitan`, billing, internal testing access | Citta | Dibutuhkan untuk AAB upload dan store/compliance setup |
| Android signing | MENUNGGU HANDOVER | Wiwitan | Keystore, alias, password, backup location, agreed rotation/recovery process | Citta + Pak Azani | Keystore dan password tidak boleh masuk repository atau chat |
| Domain/DNS/SSL | MENUNGGU AKSES | Wiwitan | Registrar, DNS provider, records, SSL renewal, API/CMS domain | Citta + Pak Azani | Cocokkan domain deployment dengan `API_URL` dan `URL_CMS` production |
| Payment gateway | CONDITIONAL | Wiwitan | Merchant account, sandbox credentials, production approval, webhook, callback URL | Citta + finance/owner | Wajib hanya bila payment flow dipakai untuk release; mulai dari sandbox |
| Email/notifikasi | MENUNGGU KONFIGURASI | Wiwitan | SMTP provider, sender/domain verification, FCM, scheduler/queue, monitoring | Citta + Pak Azani | Uji email dan push di staging sebelum production |
| Deployment/documentation | SEBAGIAN ADA | Wiwitan | `.env` shape, deployment command, migration, backup, cron, queue, rollback | Pak Azani | Lengkapi berdasarkan `docs/handoff-instruksi-original.txt` dan server aktual |

## Evidence yang Disimpan

Untuk setiap baris, simpan hanya metadata aman berikut:

```text
Service:
Owner account/email:
Developer account/email:
Role granted:
Environment: staging / production
Date received:
Last access review:
Evidence URL or screenshot path:
Open issue:
```

Jangan menyimpan password, API key, token, service-account JSON, atau isi
keystore di file ini.

## Security Finding - 2026-08-04

Read-only source verification menemukan file Firebase Admin service-account
JSON yang ter-track di repository Backend GitLab. Nilai private key tidak dibuka,
disalin, atau dimasukkan ke dokumentasi.

Tindakan wajib sebelum repository dianggap siap untuk staging/production:

1. Citta/owner Firebase membuat service-account key pengganti atau mekanisme
   workload identity yang aman.
2. Deployment staging/production memakai secret store/server environment,
   bukan file credential di Git.
3. Key lama dinonaktifkan/dihapus setelah penggunaan workload lama dipastikan
   sudah berpindah.
4. File JSON dihapus dari branch aktif dan repository history dibersihkan
   dengan persetujuan owner project.
5. Backend `.gitignore` ditambah rule untuk mencegah Firebase Admin JSON
   ter-commit ulang.
6. Repository di-scan ulang sebelum deployment.

Jangan menganggap penghapusan file dari branch terbaru saja cukup; private key
yang pernah masuk history tetap harus dianggap terekspos sampai key dicabut.

## Status Lokal Saat Ini

Hal-hal berikut sudah dapat dikerjakan tanpa akses database/server klien:

- Backend dan CMS lokal berjalan dengan SQLite/fallback lokal.
- Core flow mobile siswa, session recovery, training, dokumen, forum, dan
  notifikasi sudah diaudit pada scope lokal.
- Local migration/seed seluruh domain lulus pada fresh SQLite.
- APK production-debug berhasil dibuild, di-install ke emulator, dan launch
  smoke test lulus tanpa fatal crash.
- Dokumentasi release dan checklist Google Play sudah tersedia.

Hal-hal berikut tetap menunggu handover resmi:

- Server/database staging atau production.
- Endpoint Sardine yang disetujui.
- Firebase production dan Google Play Console.
- Keystore/signing production dan build AAB.
- Domain/DNS, SMTP/FCM, payment, serta validasi media production.

## Urutan Handover

1. Buat akun kantor GitLab dan Group private `WIWITAN`.
2. Minta Pak Azani mentransfer repository ke Group tersebut.
3. Minta Citta menambahkan akun kantor sebagai admin pada Firebase dan Play
   Console.
4. Terima akses server, staging database, storage, domain, dan service lain
   melalui role resmi.
5. Salin konfigurasi ke local secret store, jalankan validator, dan jangan
   commit file secret.
6. Rotasi credential lama setelah seluruh akses baru berhasil diverifikasi.
7. Perbarui status matrix ini dengan bukti dan tanggal review.
