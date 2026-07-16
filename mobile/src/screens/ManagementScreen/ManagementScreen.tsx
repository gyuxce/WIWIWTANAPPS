import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "components/Header";
import Space from "components/Space";
import React from "react";
import { View } from "react-native";
import { URL_CMS } from '@env';
import WebView from "react-native-webview";
import { RootStackParamList } from "types/NavigatorTypes";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";

type ManagementRouteType = RouteProp<RootStackParamList, "ManagementScreen">;

type ManagementNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ManagementScreen"
>;

type Prop = {
  route: ManagementRouteType;
  navigation: ManagementNavigationProp;
};

const ManagementScreen = ({ route }: Prop) => {
  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={5} />
      <Header
        totalNotification={4}
        textTitleLeft={route?.params?.title}
        textTitleJapanLeft=""
        withTextTitle
        withBackLeft
        onBackLeft={() => NavigationService.back()}
      />

      <WebView source={{ uri: URL_CMS + route?.params?.path }} />
    </View>
  );
};

export default ManagementScreen;
