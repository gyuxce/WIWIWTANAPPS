import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import React from "react";
import { Image, View } from "react-native";
import { scaledVertical } from "utils/ScaledService";

const SkilledTraining = () => {
  const testCondition = [
    {
      title: "Peserta Baru",
      subtitle: [
        {
          text: "Usia 18-35 tahun",
        },
        {
          text: "Pendidikan Minimal SMA/SMK sederajat (Lulusan Keperawatan atau Kebidanan lebih disukai)",
        },
        {
          text: "Sudah lulus N4 dan ujian keterampilan lebih disukai",
        },
        {
          text: "Sehat Jasmani dan Rohani",
        },
        {
          text: "Berat badan proporsional",
        },
        {
          text: "Tidak bertato",
        },
        {
          text: "Tidak buta warna",
        },
      ],
    },
    {
      title: "Ex-Pemagang",
      subtitle: [
        {
          text: "Min. 3 tahun (ginou no. 2)",
        },
        {
          text: "Lulus ujian tingkat 3/senmonkyuu/hyoukachousho (minta ke AO saat di Jepang)",
        },
        {
          text: "Sertifikat bukti program magang di Jepang (技能実習終了書). Bisa diminta ke kumiai saat di Jepang atau coba tanyakan ke LPK yang bertanggung jawab sebelumnya",
        },
      ],
    },
    {
      title: "Ex-EPA",
      subtitle: [
        {
          text: "Min. 3 tahun 10 bulan (Jika kurang dari periode tersebut harus terdaftar sebagai new comer)",
        },
        {
          text: "Lulus ujian nasional caregiver",
        },
        {
          text: "Memiliki sertifikat telah menyelesaikan program EPA",
        },
      ],
    },
  ];

  return (
    <View>
      <Space height={20} />
      <Image
        source={images.skilledTraining}
        style={{
          height: 180,
          width: 180,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <Space height={20} />
      <Text size={24} color={colors.accent} textAlign="center">
        SSW
      </Text>
      <Space height={10} />
      <Text size={12} color={colors.black} textAlign="center">
        (Specified Skilled Workers)
      </Text>
      <Space height={20} />
      <Text size={12} color={colors.black} textAlign="center" lineHeight={18}>
        SSW / Tokutei Ginou adalah Status visa/ijin tinggal bagi warga negara
        asing di Jepang. Tokutei Ginou sacara harfiah memiliki arti Specific
        Technical Skill Visa atau Visa Kerja Keahlian Khusus, sekarang lebih
        dikenal dengan Visa TG/SSW. Peserta bisa bekerja di Jepang sampai
        maksimal 5 tahun. Peserta dapat berpindah tempat kerja jika diinginkan,
        namun sama seperti TITP, peserta tidak diperbolehkan untuk membawa
        keluarga.
      </Text>
      <Space height={20} />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          backgroundColor: colors.stone50,
        }}
      >
        <Text size={12} type="bold" variant={"CenturyGothicBold"}>
          Persyaratan:
        </Text>

        {testCondition.map((item, index) => {
          return (
            <View key={index}>
              <Space height={13} />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Image
                  source={icons.checklist}
                  style={{ height: 16, width: 16, resizeMode: "contain" }}
                />
                <Text size={12} type="bold" variant={"CenturyGothicBold"}>
                  {item.title}
                </Text>
              </View>
              <Space height={7} />
              {item?.subtitle?.map((itm, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      marginBottom: 3,
                      paddingRight: 18,
                      paddingLeft: 25,
                    }}
                  >
                    <Text style={{ marginTop: scaledVertical(-3) }}>
                      {"\u2022"}
                    </Text>

                    <Text
                      size={12}
                      style={{ fontWeight: "400", lineHeight: 18, flex: 1 }}
                    >
                      {itm.text}
                    </Text>
                  </View>
                );
              })}

              {index !== testCondition.length - 1 && (
                <View>
                  <Space height={15} />
                  <Image
                    source={icons.dividerLine}
                    style={{ width: "100%", height: 2, resizeMode: "stretch" }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SkilledTraining;
