import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";
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
import NavigationService from "utils/NavigationService";
import type { RouteProp } from "@react-navigation/core";
import type { RootStackParamList } from "types/NavigatorTypes";
import { useAuth } from "hooks/useAuth";

type ActivateAccountRouteType = RouteProp<
  RootStackParamList,
  "ActivateAccountScreen"
>;

type Prop = {
  route: ActivateAccountRouteType;
};

const ActivateAccountScreen = ({ route }: Prop) => {
  const { postActivateAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!route?.params?.uuid) {
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }
    postActivateAccount(route.params.uuid)
      .then(({ status }) => {
        setIsSuccess(status === "success");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [route?.params?.uuid]);

  if (isLoading) {
    return (
      <View
        style={[
          globalStyles().container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

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
      <Image source={isSuccess ? images.goingOnwards : images.userDefault} />

      <Space height={scaledVertical(20)} />

      <Text
        variant={"CenturyGothicBold"}
        size={16}
        color={colors.accent}
        textAlign={"center"}
        type="bold"
      >
        {isSuccess ? "Akun Berhasil Diaktivasi!" : "Aktivasi Gagal"}
      </Text>

      <Space height={scaledVertical(25)} />

      <Text size={12} color={colors.black} textAlign={"center"}>
        {isSuccess
          ? "Akun kamu sudah aktif. Yuk masuk dan mulai gunakan aplikasi Wiwitan."
          : "Link aktivasi ini tidak valid atau sudah kadaluarsa. Silakan coba daftar ulang atau hubungi admin."}
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
        onPress={() => NavigationService.navigate("GuestScreen")}
      />
    </View>
  );
};

export default ActivateAccountScreen;
