import type { RouteProp } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import Button from "components/Button";
import Card from "components/Card";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import icons from "configs/icons";
import images from "configs/images";
import { useSeminar } from "hooks/useSeminar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ActivityIndicator,
  Image,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import type { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";

type BannerDetailRouteType = RouteProp<
  RootStackParamList,
  "BannerDetailScreen"
>;

type BannerDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BannerDetailScreen"
>;

type Prop = {
  route: BannerDetailRouteType;
  navigation: BannerDetailNavigationProp;
};

const BannerDetailScreen = ({ route }: Prop) => {
  const { width } = useWindowDimensions();
  const { getSeminarDetail, seminarDetail } = useSeminar();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    getSeminarDetail(route?.params?.id).then(({ status }) => {
      if (status === "success") {
        setIsLoading(false);
      }
    });
  }, []);

  const onPressFollow = () => {
    Linking.canOpenURL(seminarDetail?.link).then(ok => {
      if (ok) {
        Linking.openURL(seminarDetail?.link);
      } else {
        Alert.alert("Link bermasalah atau tidak ditemukan");
      }
    });
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={20} />
      {isLoading ? (
        <View>
          <Space height={100} />
          <ActivityIndicator size={"large"} color={colors.black} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, marginHorizontal: scaledHorizontal(25) }}
            showsVerticalScrollIndicator={false}
          >
            <Card>
              <Text type="bold" variant="CenturyGothicBold">
                {seminarDetail?.name}
              </Text>
              <Space height={20} />
              <Image
                source={
                  seminarDetail?.cover
                    ? { uri: seminarDetail?.cover?.url }
                    : images.placeholder
                }
                style={{
                  height: 311,
                  width: "100%",
                  resizeMode: "cover",
                }}
              />
              <Space height={20} />

              <View>
                <RenderHTML
                  contentWidth={width - 40}
                  enableCSSInlineProcessing={true}
                  source={{
                    html: seminarDetail?.description,
                  }}
                  tagsStyles={{
                    p: {
                      color: colors.black,
                      fontFamily: fonts.CenturyGothicRegular,
                      fontSize: 12,
                      textAlign: "left",
                      marginVertical: 0,
                      paddingHorizontal: 10,
                    },
                    li: {
                      color: colors.black,
                      fontFamily: fonts.CenturyGothicRegular,
                      fontSize: 12,
                      marginBottom: 4,
                      lineHeight: 18,
                      paddingLeft: 4,
                      paddingRight: 8,
                    },
                    ul: {
                      margin: 0,
                    },
                  }}
                  WebView={WebView}
                  systemFonts={[fonts.CenturyGothicRegular]}
                />
              </View>
              <Space height={50} />
              <Button
                onPress={onPressFollow}
                variant="CenturyGothicBold"
                textType="bold"
                title="Ikuti"
                type="light"
                style={{ paddingVertical: 12, minWidth: "100%" }}
                textStyle={{
                  fontSize: 12,
                  lineHeight: 18,
                }}
              />
            </Card>
          </ScrollView>
          <Space height={20} />
          <Button
            onPress={() => NavigationService.back()}
            variant="CenturyGothicBold"
            textType="bold"
            type="light"
            style={{
              width: 38,
              height: 38,
              borderRadius: 38 / 2,
              alignSelf: "center",
            }}
            textStyle={{
              fontSize: 22,
              lineHeight: 18,
            }}
            icon={icons.iconX}
            iconStyle={{ width: 18, height: 18, resizeMode: "contain" }}
          />
          <Space height={30} />
        </View>
      )}
    </View>
  );
};

export default BannerDetailScreen;
