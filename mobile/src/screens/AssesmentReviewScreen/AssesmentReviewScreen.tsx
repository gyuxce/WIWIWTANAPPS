import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import { ResizeMode, Video } from "expo-av";
import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";
import { videoExtensions } from "utils/Utils";

type VerifyURLRouteType = RouteProp<
  RootStackParamList,
  "AssesmentReviewScreen"
>;

type VerifyURLNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AssesmentReviewScreen"
>;

type Prop = {
  route: VerifyURLRouteType;
  navigation: VerifyURLNavigationProp;
};

const AssesmentReviewScreen = ({ route }: Prop) => {
  const video = useRef(null as any);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={5} />
      <Header
        withBackLeft
        textTitleLeft={route?.params?.title}
        titleLeft
        textTitleJapanLeft={route?.params?.title}
        onBackLeft={() => NavigationService.back()}
      />
      <Space height={20} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: scaledHorizontal(25) }}
      >
        {route?.params?.file &&
        videoExtensions?.some(ext =>
          route?.params?.file?.filename?.endsWith("." + ext),
        ) ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              height: 200,
              minHeight: 200,
            }}
          >
            <Video
              ref={video}
              source={{
                uri: route?.params?.file?.url,
              }}
              style={{ height: "100%", width: "100%" }}
              useNativeControls
              shouldPlay={false}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              volume={80}
            />
          </View>
        ) : (
          <View>
            <Text>Not a video file</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AssesmentReviewScreen;
