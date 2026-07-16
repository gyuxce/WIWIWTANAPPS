import images from "configs/images";
import icons from "configs/icons";

import ListCarousel from "./ListCarousel/ListCarousel";

const dataTest = [
  {
    title: "Tes Bakat Bahasa",
  },
  {
    title: "Tes karakter",
  },
  {
    title: "Sesi Tanya Jawab",
  },
];

const dataPembayaran = [
  {
    title: "Biaya Administrasi",
  },
  {
    title: "Biaya Pelatihan",
  },
];

const dataPelatihan = [
  {
    title: "Teori Bahasa Jepang",
  },
  {
    title: "Praktikal Bahasa Jepang",
  },
  {
    title: "Soft Skill",
  },
];

const dataSertifikasi = [
  {
    title: "Tes Pertama",
  },
  {
    title: "Tes Kedua",
  },
];

const dataWawancara = [
  {
    title: "Wawancara Kerja",
  },
  {
    title: "Keberangkatan",
  },
];

export const PratestComponent = () => {
  return (
    <ListCarousel
      dataTest={dataTest}
      imageHeader={images.imagePerjalanan}
      title="Pra Tes"
      imageTitle={icons.japanBook}
    />
  );
};

export const PaymentComponent = () => {
  return (
    <ListCarousel
      dataTest={dataPembayaran}
      imageHeader={icons.payment}
      title="Pembayaran"
      imageTitle={icons.paymentJapan}
    />
  );
};

export const TrainingComponent = () => {
  return (
    <ListCarousel
      dataTest={dataPelatihan}
      imageHeader={icons.pelatihan}
      title="Pelatihan"
      imageTitle={icons.pelatihanJapan}
    />
  );
};

export const SertifikasiComponent = () => {
  return (
    <ListCarousel
      dataTest={dataSertifikasi}
      imageHeader={icons.sertifikasi}
      title="Sertifikasi Bahasa Jepang"
      imageTitle={icons.sertifikasiJapan}
    />
  );
};

export const InterviewComponent = () => {
  return (
    <ListCarousel
      dataTest={dataWawancara}
      imageHeader={icons.wawancara}
      title="Wawancara Final"
      imageTitle={icons.wawancaraJapan}
    />
  );
};
