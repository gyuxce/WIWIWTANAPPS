import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "components/Header";
import Space from "components/Space";
import React from "react";
import { View } from "react-native";

import WebView from "react-native-webview";
import { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";

type WebviewCharacterRouteType = RouteProp<
  RootStackParamList,
  "WebviewCharacter"
>;

type WebviewCharacterNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WebviewCharacter"
>;

type Prop = {
  route: WebviewCharacterRouteType;
  navigation: WebviewCharacterNavigationProp;
};

const WebviewCharacter = ({ route }: Prop) => {
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={5} />
      <Header
        withBackLeft
        textTitleLeft="PraTest Karakter"
        titleLeft
        textTitleJapanLeft="性格テスト"
        onBackLeft={() => NavigationService.back()}
      />
      {/* <RenderHTML
        source={{ uri: "https://google.com" }}
        contentWidth={width - 70}
        enableCSSInlineProcessing={true}
        WebView={WebView}
        ignoredDomTags={["center"]}
      /> */}
      <Space height={15} />
      <WebView source={{ uri: route?.params?.link }} />
    </View>
  );
};

export default WebviewCharacter;
