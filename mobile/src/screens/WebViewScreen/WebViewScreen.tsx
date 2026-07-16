import React, { useEffect, useState } from "react";
import type { WebViewNavigation } from "react-native-webview";
import { WebView } from "react-native-webview";
import { ActivityIndicator, Platform, SafeAreaView, View } from "react-native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import Space from "components/Space";
import Header from "components/Header";
import colors from "configs/colors";
import { wait } from "utils/Utils";
import NavigationService from "utils/NavigationService";
import images from "configs/images";
import { usePayment } from "hooks/usePayment";

type WebviewRouteType = RouteProp<RootStackParamList, "WebViewScreen">;

type WebviewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WebViewScreen"
>;

type Prop = {
  route: WebviewRouteType;
  navigation: WebviewNavigationProp;
};

const WebviewScreen = ({ route }: Prop) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getPaymentStatusType } = usePayment();

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    let screenParams: any = {
      textJapan: "エラーが発生しました",
      textTitle: "Terjadi kesalahan pembayaran",
      textSubtitle:
        "Mohon maaf pembayaran tidak dapat diproses. Silakan ulangi transaksi atau hubungi tim Wiwitan.",
      textButton: "Kembali ke Pembayaran",
      identifier: "go-back",
      image: images.gotProblem,
      titleType: "big",
      imageSize: "small",
    };
    if (route?.params?.from === "AdministrationPayment") {
      if (url.includes("success") || url.includes("failed")) {
        getPaymentStatusType();
        if (url.includes("success")) {
          screenParams = {
            ...screenParams,
            textJapan: "ありがとうございます！",
            textTitle: "Terima kasih!",
            textSubtitle:
              "Pembayaran telah diverifikasi. Yuk lanjutkan ke pembayaran selanjutnya!",
            textButton: "Lanjutkan Pembayaran Pelatihan",
            identifier: "pembayaran-administrasi-success",
            image: images.perjalananStatus,
          };
        }
        NavigationService.replace("PaymentTypeScreen", screenParams);
      }
    }
    if (route?.params?.from === "TrainingPayment") {
      if (url.includes("success") || url.includes("failed")) {
        getPaymentStatusType();
        if (url.includes("success")) {
          screenParams = {
            ...screenParams,
            textJapan: "ありがとうございます！",
            textTitle: "Terima kasih!",
            textSubtitle:
              "Pembayaran telah diverifikasi. Yuk lanjutkan ke langkah berikutnya!",
            textButton: "Mulai Pelatihan",
            identifier: "go-back",
            image: images.perjalananStatus,
          };
        }
        NavigationService.replace("PaymentTypeScreen", screenParams);
      }
    }
  };

  useEffect(() => {
    wait(1000).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />

      <SafeAreaView style={[globalStyles().container]}>
        <Header
          withBell
          totalNotification={4}
          withBackButton
          withTextTitle
          textJapan="支払い"
          textTitle="Pembayaran"
        />
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <WebView
            androidLayerType="software"
            androidHardwareAccelerationDisabled={true}
            onLoad={() => setIsLoading(false)}
            source={{ uri: route?.params?.uri || "https://google.com" }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            style={{ flex: 1 }}
            originWhitelist={[
              "http://",
              "https://",
              "intent://",
              "itms-appss://",
            ]}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default WebviewScreen;
