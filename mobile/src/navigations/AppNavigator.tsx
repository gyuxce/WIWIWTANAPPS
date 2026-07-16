import { NavigationContainer } from "@react-navigation/native";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { navigationRef } from "utils/NavigationService";
import ToastComponent from "components/ToastComponent";
import { useError } from "hooks/useError";
import type { ErrorType } from "stores/error/errorSlice";
import { onErrorState } from "stores/error/errorSlice";
import { useDispatch } from "react-redux";
import { wait } from "utils/Utils";
import { type ImageSourcePropType, ActivityIndicator } from "react-native";
import { URL_SCHEME, API_URL, URL_CMS } from '@env';

import MainNavigator from "./MainNavigator";

const App = createStackNavigator<RootStackParamList>();
const options: StackNavigationOptions = {
  headerTintColor: "#65b6e5",
  headerBackTitleVisible: false,
  headerTitleAlign: "center",
  headerTitleStyle: {
    //fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    fontSize: 14,
    color: "#4a4a4a",
  },
  // headerStyle: {
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  //   shadowOpacity: 0.27,
  //   shadowRadius: 4.65,

  //   elevation: 6,
  // },
  // headerLeft: () => (
  //   <TouchableOpacity
  //     onPress={NavigationService.back}
  //     style={{
  //       paddingVertical: scaledVertical(15),
  //       paddingRight: scaledHorizontal(20),
  //     }}>
  //     <Image
  //       source={icon.backIcon}
  //       style={{
  //         height: scaledVertical(36),
  //         width: scaledHorizontal(36),
  //         marginLeft: scaledHorizontal(10),
  //       }}
  //     />
  //   </TouchableOpacity>
  // ),
  // headerBackImage: () => (

  // ),
  //cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
// const transparentModalOptions: StackNavigationOptions = {
//   presentation: "transparentModal",
//   headerShown: false,
//   cardStyle: { backgroundColor: "transparent" },
//   cardOverlayEnabled: true,
//   cardStyleInterpolator: ({ current: { progress } }) => ({
//     cardStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 0.5, 0.9, 1],
//         outputRange: [0, 0.25, 0.7, 1],
//       }),
//     },
//     overlayStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//         extrapolate: "clamp",
//       }),
//     },
//   }),
// };

// const halfModalOptions: StackNavigationOptions = {
//   cardStyle: { backgroundColor: "transparent" },
//   cardOverlayEnabled: true,
//   presentation: "transparentModal",
//   cardStyleInterpolator: ({ current: { progress } }) => ({
//     cardStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 0.75, 1],
//         outputRange: [0, 0.5, 1],
//       }),
//     },
//     overlayStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//         extrapolate: "clamp",
//       }),
//     },
//   }),
// };

// const halfModalBottomOptions: StackNavigationOptions = {
//   cardStyle: { backgroundColor: "transparent" },
//   presentation: "transparentModal",
//   headerShown: false,
//   cardOverlayEnabled: true,
//   cardStyleInterpolator: ({ current: { progress } }) => ({
//     cardStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 0.75, 1],
//         outputRange: [0, 0.5, 1],
//       }),
//     },
//     overlayStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//         extrapolate: "clamp",
//       }),
//     },
//   }),
// };
// const halfModalBottomOptions: StackNavigationOptions = {
//   cardStyle: { backgroundColor: "transparent" },
//   presentation: "transparentModal",
//   headerShown: false,
//   cardOverlayEnabled: true,
//   cardStyleInterpolator: ({ current: { progress } }) => ({
//     cardStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 0.75, 1],
//         outputRange: [0, 0.5, 1],
//       }),
//     },
//     overlayStyle: {
//       opacity: progress.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.5],
//         extrapolate: "clamp",
//       }),
//     },
//   }),
// };

const AppNavigator = () => {
  const { error } = useError();
  const dispatch = useDispatch();

  const onCloseToast = () => {
    wait(2000).then(() => {
      const err: ErrorType = {
        visible: false,
        text: "",
        withIcon: false,
        icon: "" as ImageSourcePropType,
        withCloseIcon: false,
      };
      dispatch(onErrorState(err));
    });
  };

  const config = {
    screens: {
      MainNavigator: {
        initialRouteName: "AppStackNavigator",
        screens: {
          AppStackNavigator: {
            screens: {
              HomeScreen: {
                path: "/",
              },
              ResetPasswordScreen: {
                path: "reset-password/:token",
              },
              ForumDetailScreen: {
                path: "mobile/forum/:id",
              },
            },
          },
        },
      },
    },
  };

  const linking: any = {
    prefixes: [
      URL_SCHEME,
      API_URL,
      URL_CMS,
      "https://staging.cms.wiwitan.62dev.com/",
      "https://cms.wiwitanbaru.com",
    ],
    config,
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<ActivityIndicator color="black" size="large" />}

      //onStateChange={state => console.log("New state is", state)}
    >
      <App.Navigator screenOptions={options}>
        <App.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </App.Navigator>
      <ToastComponent
        visible={error.visible}
        text={error.text}
        icon={error.icon}
        withIcon={error.withIcon}
        onHide={onCloseToast}
        onShown={onCloseToast}
      />
    </NavigationContainer>
  );
};

export default AppNavigator;
