/* eslint-disable max-len */
const getInfo = (data: any) => [
  {
    title: "Informasi Identifikasi",
    withBullet: true,
    subtitle: [
      {
        text: "Nama Perusahaan: Wiwitan",
      },
      {
        text: "Alamat:",
        subsubtitle: [
          {
            text: "Jl. Goalpara no. 5 RT. 001 RW. 006, Desa/Kec. Sukaraja, Kab. Sukabumi 43192",
          },
          {
            text: "atau TEKAD Building Jl. Toyaning no. 18, Kedonganan, Kec. Kuta, Kab. Badung, Prov. Bali 80361",
          },
        ],
      },
      {
        text: "Email: hello@wiwitanbaru.com",
      },
      { text: "Nomor Telepon: +62 813-2289-2158" },
    ],
  },
  {
    title: "Deskripsi Pelatihan",
    withBullet: true,
    subtitle: [
      {
        text: "Program Magang Perawat di Jepang (Technical Intern Training Program/TITP) dan Program Bekerja Fulltime Perawat di Jepang (SSW Caregiver/SSW)",
      },
      {
        text: "Durasi Pelatihan: 6 Bulan sampai 12 Bulan",
      },
      {
        text: "Tujuan: Menjembatani kesenjangan antara negara-negara dengan populasi kurang mampu dan populasi yang menurun melalui penciptaan lapangan kerja dan pemberdayaan ekonomi.",
      },
      {
        text: "Manfaat: Memberdayakan para profesional menjadi sumber daya manusia yang mampu bertaraf internasional dan berdaya saing untuk meningkatkan kualitas hidup dan memberikan kontribusi kepada masyarakat dan negara.",
      },
    ],
  },
  {
    title: "Syarat Pendaftaran",
    withBullet: true,
    subtitle: [
      {
        text: "Pendidikan Terakhir: SMA sederajat",
      },
      {
        text: "Kriteria Pemilihan: Tidak ada batasan kriteria pemilihan",
      },
      {
        text: "Batasan Usia: Tidak ada batasan usia",
      },
    ],
  },
  {
    title: "Biaya",
    withBullet: true,
    subtitle: [
      {
        text: `Administrasi: Rp ${
          data?.find((item: any) => item?.type === 1)?.amount_label || "0"
        },-`,
      },
      {
        text: `Pelatihan: Rp ${
          data?.find((item: any) => item?.type === 2)?.amount_label || "0"
        },-`,
      },
      {
        text: "Pembayaran dapat dilakukan didalam mobile app.",
      },
      {
        text: "Kebijakan Pengembalian Dana: Tidak ada kebijakan pengembalian dana.",
      },
    ],
  },
  {
    title: "Jadwal dan Lokasi",
    withBullet: true,
    subtitle: [
      {
        text: "Pelatihan berlangsung selama 6 sampai 12 Bulan",
      },
      {
        text: "Lokasi: Hybrid (Online/Offline). Offline hanya untuk sertifikasi Bahasa Jepang/kegiatan lainnya jika ada.",
      },
    ],
  },
  {
    title: "Kewajiban Peserta",
    withBullet: true,
    subtitle: [
      {
        text: "Peserta wajib mengikuti pelatihan sampai selesai.",
      },
      {
        text: "Peserta wajib menyelesaikan seluruh materi yang diberikan dan mencapai nilai minimum yang ditentukan.",
      },
      {
        text: "Peserta wajib mengikuti sertifikasi bahasa Jepang dan mencapai nilai minimum yang ditentukan.",
      },
    ],
  },
  {
    title: "Hak dan Kewajiban Penyelenggara",
    withBullet: true,
    subtitle: [
      {
        text: "Wiwitan memberikan pelatihan dan arahan terkait jenjang karir yang dituju.",
      },
      {
        text: "Wiwitan bersedia memberikan Bantuan Dana bagi siswa yang membutuhkan.",
      },
      {
        text: "Wiwitan berhak mengubah jadwal kegiatan jika terjadi suatu hal tertentu.",
      },
    ],
  },
  {
    title: "Kebijakan Privasi dan Keamanan Data",
    withBullet: true,
    subtitle: [
      {
        text: "Pihak Wiwitan tidak menggunakan data siswa untuk keperluan pribadi. Siswa dapat sewaktu-waktu menghapus datanya sendiri jika diperlukan.",
      },
      {
        text: "Segala bentuk materi atau sumber daya yang disediakan adalah hak milik Wiwitan. Dilarang menyebarkan atau menggunakan informasi tersebut bukan sebagaimana mestinya.",
      },
    ],
  },
];

export default getInfo;
