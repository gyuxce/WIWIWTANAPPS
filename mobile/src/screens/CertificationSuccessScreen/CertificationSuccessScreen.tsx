import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, View, useWindowDimensions } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

const CertificationSuccessScreen = () => {
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  return (
    <View
      style={[
        globalStyles().topSafeArea,
        {
          paddingTop: height / 4,
          alignItems: "center",
          paddingHorizontal: scaledHorizontal(25),
        },
      ]}
    >
      <Image
        source={images.waiting}
        style={{
          resizeMode: "contain",
          height: 200,
          width: 200,
        }}
      />
      <Space height={10} />
      <Text size={60} color={colors.accent}>
        評価中!
      </Text>
      <Text
        color={colors.accent}
        type={"bold"}
        variant="CenturyGothicBold"
        textAlign="center"
      >
        {t("hasil_sertifikasi_kamu_dalam_review")}
      </Text>
      <Space height={10} />
      <Text size={12} lineHeight={18} textAlign="center">
        {t("kendala_sertifikasi")}
      </Text>
      <Space height={20} />
      <Button
        onPress={() => NavigationService.navigate("JapanCertificateScreen")}
        title={t("kembali")}
        style={{ width: "100%", paddingVertical: scaledVertical(25) }}
        textStyle={{ fontWeight: "900" }}
      />
    </View>
  );
};

export default CertificationSuccessScreen;
