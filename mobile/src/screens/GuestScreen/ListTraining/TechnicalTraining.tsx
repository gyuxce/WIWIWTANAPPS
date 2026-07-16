import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { Image, View } from "react-native";
import { scaledVertical } from "utils/ScaledService";

const TechnicalTraining = () => {
  const testCondition = [
    { text: "Usia 18-40 tahun" },
    { text: "Lulusan SMK/D3/S1 Keperawatan atau Kebidanan" },
    { text: "Sehat jasmani dan rohani" },
    { text: "Berat badan proporsional" },
    { text: "Tidak bertato" },
    { text: "Tidak buta warna" },
  ];
  return (
    <View>
      <Space height={20} />
      <Image
        source={images.technicalTraining}
        style={{
          height: 200,
          width: 200,
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <Text size={24} color={colors.accent} textAlign="center">
        TITP
      </Text>
      <Space height={10} />
      <Text size={12} color={colors.black} textAlign="center">
        (Technical Intern Training Program)
      </Text>
      <Space height={20} />
      <Text size={12} color={colors.black} textAlign="center" lineHeight={18}>
        Program TITP sendiri merupakan sebuah program pelatihan magang di Jepang
        yang dilaksanakan selama 3 tahun. Pada program ini, para peserta
        diharapkan mampu meningkatkan pengetahuan tentang kemajuan teknologi
        industri Jepang, menguasai kompetensi kerja dan bahasa Jepang, serta
        mengaplikasikan perubahan sikap dan budaya kerja yang lebih professional
        di Indonesia. Selain itu, para peserta juga diberikan pelatihan untuk
        bisa mahir berbahasa Jepang, mengenal budaya serta kehidupan di Jepang.
        Pada program ini tidak diperbolehkan untuk berpindah tempat kerja dan
        juga tidak diperbolehkan membawa keluarga.
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
        <Space height={10} />
        {testCondition.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: "row",
                gap: 4,
                marginBottom: 3,
                paddingRight: 18,
                paddingLeft: 5,
              }}
            >
              <Text style={{ marginTop: scaledVertical(-3) }}>{"\u2022"}</Text>

              <Text
                size={12}
                style={{ fontWeight: "400", lineHeight: 18, flex: 1 }}
              >
                {item.text}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TechnicalTraining;
