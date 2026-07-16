import React from "react";
import { View, Image } from "react-native";
import globalStyles from "utils/GlobalStyles";
import Text from "components/Text";
import images from "configs/images";
import Space from "components/Space";
import {
  scaledFontSize,
  scaledVertical,
  scaledHorizontal,
} from "utils/ScaledService";
import colors from "configs/colors";
import Button from "components/Button";
import { CommonActions, useNavigation } from "@react-navigation/core";

const SignupSuccessScreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        globalStyles().container,
        {
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: scaledHorizontal(25),
        },
      ]}
    >
      <Image source={images.goingOnwards} />

      <Space height={scaledVertical(20)} />

      <Text variant="OpificioNeueRegular" size={48} color={colors.accent}>
        ようこそ！
      </Text>

      <Space height={10} />

      <Text
        variant={"CenturyGothicBold"}
        size={16}
        color={colors.accent}
        textAlign={"center"}
        type="bold"
      >
        Behasil mendaftar
      </Text>

      <Space height={scaledVertical(25)} />

      <Text size={12} color={colors.black} textAlign={"center"}>
        Selamat sudah bergabung dengan Wiwitan, yuk masuk dan lanjutkan proses
        pembayarannya.
      </Text>

      <Space height={scaledVertical(20)} />

      <Button
        variant="CenturyGothicBold"
        textType="bold"
        title="Masuk"
        type="light"
        style={{ paddingVertical: 12, width: "100%" }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "GuestScreen" }],
            }),
          );
        }}
      />
    </View>
  );
};

export default SignupSuccessScreen;
