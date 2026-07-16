import { t } from "i18next";

export const DOCUMENT_TYPE = {
  PELATIHAN: 1,
  TES_BAHASA: 2,
  TES_KARAKTER: 3,
  PEMBAYARAN: 4,
  SERTIFIKASI_BAHASA_JEPANG: 5,
};

export const USER_DOCUMENTS = {
  PELATIHAN: [
    // { label: "KTP", slug: "KTP" },
    // { label: "Kartu Keluarga", slug: "KK" },
    {
      label: t("ijazah"),
      slug: "IJAZAH",
      allowUpload: true,
      uploadText: t("upload_ijazah"),
      isRequired: true,
    },
    {
      label: "CV",
      slug: "CV",
      allowUpload: true,
      uploadText: t("upload_cv"),
      isRequired: true,
    },
    {
      label: t("paspor"),
      slug: "PASPOR",
      allowUpload: true,
      uploadText: t("upload_paspor"),
    },
  ],
  //TES_BAHASA: [{ label: "Hasil Tes Bahasa", slug: "TES BAHASA" }],
  TES_KARAKTER: [
    { label: t("hasil_tes_karakter"), slug: "TES KARAKTER" },
    // { label: "Hasil Tes Cavlent", slug: "TES CAVLENT" },
  ],
  PEMBAYARAN: [
    {
      label: t("surat_pernyataan_pelatihan"),
      slug: "SURAT PELATIHAN",
    },
    {
      label: t("surat_pernyataan_cicilan_pribadi"),
      slug: "SURAT CICILAN PRIBADI",
    },
    {
      label: t("surat_pernyataan_bantuan_dana"),
      slug: "SURAT BANTUAN DANA",
    },
    {
      label: t("ktp"),
      slug: "KTP",
    },
    {
      label: t("ktp_ortu_wali"),
      slug: "KTP WALI",
    },
    // {
    //   label: "KTP Pasangan",
    //   slug: "KTP PASANGAN",
    // },
    // {
    //   label: "Buku Nikah",
    //   slug: "BUKU NIKAH",
    // },
    // {
    //   label: "Surat Persetujuan Pasutri",
    //   slug: "SURAT PASUTRI",
    // },
    // {
    //   label: "Kartu Keluarga",
    //   slug: "KK",
    // },
    // {
    //   label: "Surat Pernyataan BPR",
    //   slug: "SURAT BPR",
    // },
    // {
    //   label: "Surat Domisili KTP",
    //   slug: "SURAT DOMISILI KTP",
    // },
  ],
  SERTIFIKASI_BAHASA_JEPANG: [
    {
      label: t("sertfikat_bahasa_jepang"),
      slug: "SERTIFIKASI BAHASA JEPANG",
    },
    {
      label: t("sertifikat_keterampilan"),
      value: "SERTIFIKASI KETERAMPILAN",
    },
  ],
};
