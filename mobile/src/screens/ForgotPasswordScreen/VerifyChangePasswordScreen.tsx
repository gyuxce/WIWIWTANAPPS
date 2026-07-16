import React, { useState, useEffect } from "react";
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
import { type RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { useAuth } from "hooks/useAuth";

type VerifyURLRouteType = RouteProp<
  RootStackParamList,
  "VerifyChangePasswordScreen"
>;

type VerifyURLNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VerifyChangePasswordScreen"
>;

type Prop = {
  route: VerifyURLRouteType;
  navigation: VerifyURLNavigationProp;
};

const VerifyChangePasswordScreen = ({ route }: Prop) => {
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const { postForgotPassword } = useAuth();

  const startTimer = () => {
    setButtonDisabled(true);
    setTimer(60);
  };

  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isButtonDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setButtonDisabled(false);
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isButtonDisabled, timer]);

  const onPressForgotPassword = () => {
    postForgotPassword(route?.params?.email).then(({ status }) => {
      if (status === "success") {
        startTimer();
        startTimer();
      }
    });
  };

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
      <Image
        source={images.logoLong2}
        style={{ height: 115, width: "80%", resizeMode: "cover" }}
      />

      <Space height={44} />

      <Text
        size={12}
        color={colors.black}
        style={{ paddingHorizontal: 20 }}
        textAlign={"center"}
      >
        Periksa emailmu dan klik tautan yang kami kirim untuk mengatur ulang
        kata sandi akunmu.
      </Text>

      <Space height={20} />

      <Text size={scaledFontSize(20)} color={colors.black} textAlign={"center"}>
        Tidak Mendapatkan Email?
      </Text>

      <Space height={scaledVertical(20)} />

      <Button
        variant="CenturyGothicBold"
        textType="bold"
        title="Kirim ulang tautan"
        type="light"
        style={{ paddingVertical: 12, width: "100%" }}
        textStyle={{
          fontSize: scaledFontSize(20),
          lineHeight: 18,
        }}
        disabled={isButtonDisabled}
        onPress={onPressForgotPassword}
        withBorder={!isButtonDisabled}
      />
      <Space height={scaledVertical(20)} />

      <Text
        variant={"CenturyGothicBold"}
        size={scaledFontSize(20)}
        color={colors.red}
      >
        {String(Math.floor(timer / 60)).padStart(2, "0")}:
        {String(timer % 60).padStart(2, "0")}
      </Text>
    </View>
  );
};
export default VerifyChangePasswordScreen;
