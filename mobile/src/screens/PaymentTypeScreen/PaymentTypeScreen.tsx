import type { RouteProp } from "@react-navigation/core";
import { CommonActions, useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Button from "components/Button";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { t } from "i18next";
import React from "react";
import { Image, Platform, View } from "react-native";
import type { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledFontSize, scaledHorizontal } from "utils/ScaledService";

type PaymentTypeRouteType = RouteProp<RootStackParamList, "PaymentTypeScreen">;

type PaymentTypeNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentTypeScreen"
>;

type Prop = {
  route: PaymentTypeRouteType;
  navigation: PaymentTypeNavigationProp;
};

const PaymentTypeScreen = ({ route }: Prop) => {
  const navigation: any = useNavigation();
  const onPressButton = () => {
    if (route?.params?.identifier === "pembayaran-pelatihan-success") {
      NavigationService.navigate("InstallmentPaymentScreen");
    } else if (route?.params?.identifier === "installment-full-payment") {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        }),
      );
    } else if (
      route?.params?.identifier === "pembayaran-administrasi-success"
    ) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: "HomeScreen" },
            {
              name: "InstallmentPaymentScreen",
            },
          ],
        }),
      );
    } else if (route?.params?.identifier === "go-back") {
      NavigationService.back();
    }
  };
  const onPressSecondButton = () => {
    if (route?.params?.secondIdentifier === "go-back") {
      NavigationService.back();
    }
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        withBackButton={
          route?.params?.identifier === "pembayaran-administrasi-success" ||
          route?.params?.identifier === "pembayaran-pelatihan-success"
            ? false
            : true
        }
        withTextTitle
        textJapan="支払い"
        textTitle="Pembayaran"
      />
      <View>
        <Space height={100} />
        {route?.params?.image && (
          <Image
            source={route?.params?.image}
            style={{
              height: route?.params?.imageSize ? 200 : 146,
              width: route?.params?.imageSize ? 200 : 165,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
        )}

        <Space height={5} />
        <Text
          textAlign="center"
          size={route?.params?.titleType ? 60 : 48}
          color={colors.accent}
          type="bold"
          variant={"OpificioNeueRegular"}
        >
          {route?.params?.textJapan}
        </Text>
        <Text
          textAlign="center"
          size={16}
          color={colors.accent}
          type="bold"
          variant={"CenturyGothicBold"}
        >
          {route?.params?.textTitle}
        </Text>
        <Space height={15} />
        <Text
          size={12}
          textAlign="center"
          style={{ marginHorizontal: scaledHorizontal(50) }}
        >
          {route?.params?.textSubtitle}
        </Text>
        <Space height={15} />
        <Button
          onPress={onPressButton}
          variant="CenturyGothicBold"
          textType="bold"
          title={route?.params?.textButton}
          type="light"
          style={{
            paddingVertical: 12,

            marginHorizontal: scaledHorizontal(50),
          }}
          withBorder={true}
          textStyle={{
            fontSize: scaledFontSize(20),
            lineHeight: 18,
          }}
        />
        {route?.params?.secondBtnText && (
          <View>
            <Space height={12} />
            <Text textAlign="center" size={12}>
              {t("atau")}
            </Text>
            <Space height={12} />
            <Button
              onPress={onPressSecondButton}
              variant="CenturyGothicBold"
              textType="bold"
              title={route?.params?.secondBtnText}
              type="light"
              style={{
                paddingVertical: 12,

                marginHorizontal: scaledHorizontal(50),
              }}
              withBorder={true}
              textStyle={{
                fontSize: scaledFontSize(20),
                lineHeight: 18,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PaymentTypeScreen;
