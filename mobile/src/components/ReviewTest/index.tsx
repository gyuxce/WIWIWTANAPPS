import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import { t } from "i18next";
import React from "react";
import { View, Image } from "react-native";
import { scaledHorizontal } from "utils/ScaledService";

const ReviewTest = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: scaledHorizontal(25),
      }}
    >
      <Image
        source={images.waiting}
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
        評価中!
      </Text>
      <Text color={colors.accent} size={16} style={{ fontWeight: "900" }}>
        {t("tes_kamu_sedang_direview")}
      </Text>
      <Space height={15} />
      <Text
        textAlign="center"
        size={12}
        style={{
          fontWeight: "400",
          paddingHorizontal: scaledHorizontal(5),
        }}
      >
        {t("tes_telah_selesai")}
      </Text>
    </View>
  );
};

export default ReviewTest;
