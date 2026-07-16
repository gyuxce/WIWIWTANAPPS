import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import images from "configs/images";
import React from "react";
import { Image, View, useWindowDimensions } from "react-native";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";

const FinishAssesment = () => {
  const { height } = useWindowDimensions();
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
        source={images.imagePerjalanan}
        style={{
          resizeMode: "contain",
          height: 200,
          width: 200,
        }}
      />
      <Space height={10} />
      <Text size={60} color={colors.accent}>
        よく出来ました!
      </Text>
      <Text
        color={colors.accent}
        type={"bold"}
        variant="CenturyGothicBold"
        textAlign="center"
      >
        Tes Selesai!
      </Text>
      <Space height={10} />
      <Text size={12} lineHeight={18} textAlign="center">
        Tim Wiwitan akan segera memprosesnya, dan hasil tes akan segera kami
        kabari.
      </Text>
      <Space height={20} />
      <Button
        onPress={() => NavigationService.back()}
        title="Kembali ke Materi"
        style={{ width: "100%", paddingVertical: scaledVertical(25) }}
        textStyle={{ fontWeight: "900" }}
      />
    </View>
  );
};

export default FinishAssesment;
