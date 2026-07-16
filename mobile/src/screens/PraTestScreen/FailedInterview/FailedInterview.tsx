import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

interface FailedInterviewProps {
  onClickAdminWhatsapp: () => void;
}

const FailedInterview = ({ onClickAdminWhatsapp }: FailedInterviewProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: scaledHorizontal(25),
      }}
    >
      <Image
        source={images.failedBalloon}
        style={{
          height: 200,
          width: 200,
          resizeMode: "contain",
        }}
      />
      <Text
        color={colors.accent}
        size={48}
        variant="OpificioNeueRegular"
        style={{ fontWeight: "400" }}
      >
        不合格でした。また挑戦しよう!
      </Text>
      <Text color={colors.accent} size={16} style={{ fontWeight: "900" }}>
        Belum lulus tes
      </Text>
      <Space height={15} />
      <Text
        textAlign="center"
        size={12}
        style={{
          fontWeight: "400",
          paddingHorizontal: scaledHorizontal(20),
        }}
      >
        Wah sayang sekali kamu belum lulus seleksi. Kamu belum bisa melanjutkan
        proses pelatihan saat ini.
      </Text>
      <Space height={10} />
      <Text
        textAlign="center"
        size={12}
        style={{
          fontWeight: "400",
          paddingHorizontal: scaledHorizontal(20),
        }}
      >
        Persiapkan dirimu lebih baik dan coba lagi di tahun depan!
      </Text>
      <Space height={10} />
      <Button
        onPress={onClickAdminWhatsapp}
        title={"Hubungi Admin Wiwitan"}
        style={{
          paddingVertical: 12,
          width: "95%",
        }}
        textStyle={{ fontSize: 12 }}
        textType="bold"
        variant="CenturyGothicBold"
        withBorder={true}
      />
    </View>
  );
};

export default FailedInterview;
