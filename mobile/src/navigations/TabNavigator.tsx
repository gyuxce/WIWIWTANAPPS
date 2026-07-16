/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Keyboard, Platform } from "react-native";
import icons from "configs/icons";
import { scaledVertical } from "utils/ScaledService";
import { useEffect, useState } from "react";

import HomeTab from "./Tabs/HomeTab";
import ProfileTab from "./Tabs/ProfileTab";
import ForumTab from "./Tabs/ForumTab";
import TrainingTab from "./Tabs/TrainingTab";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "black",
          borderLeftWidth: 1,
          borderLeftColor: "black",
          borderRightWidth: 1,
          borderRightColor: "black",
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,

          elevation: 18,
          height: Platform.OS === "android" ? 58.5 : 75,
          paddingTop: 20,
          backgroundColor: "white",
          position: "absolute",

          gap: 10,
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={icons.bottomSelected.home}
                resizeMode="contain"
                style={{
                  width: 83,
                  height: 45,
                  top: keyboardStatus
                    ? 0
                    : Platform.OS === "android"
                    ? -20.5
                    : -14,
                }}
              />
            ) : (
              <Image
                source={icons.bottomDefault.home}
                resizeMode="contain"
                style={{
                  width: 23,
                  height: 23,
                  top: scaledVertical(Platform.OS === "android" ? -17 : -2),
                }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingTab}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={icons.bottomSelected.pencil}
                resizeMode="contain"
                style={{
                  width: 83,
                  height: 45,
                  top: keyboardStatus
                    ? 0
                    : Platform.OS === "android"
                    ? -20.5
                    : -14,
                }}
              />
            ) : (
              <Image
                source={icons.bottomDefault.pencil}
                resizeMode="cover"
                style={{
                  width: 23,
                  height: 23,
                  top: scaledVertical(Platform.OS === "android" ? -17 : -2),
                }}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumTab}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused }) => {
            return !keyboardStatus && focused ? (
              <Image
                source={icons.bottomSelected.chat}
                resizeMode="contain"
                style={{
                  width: 83,
                  height: 45,
                  top: keyboardStatus
                    ? 0
                    : Platform.OS === "android"
                    ? -20.5
                    : -14,
                }}
              />
            ) : (
              <Image
                source={icons.bottomDefault.chat}
                resizeMode="contain"
                style={{
                  width: 23,
                  height: 23,
                  top: scaledVertical(Platform.OS === "android" ? -17 : -2),
                }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={icons.bottomSelected.profile}
                resizeMode="contain"
                style={{
                  width: 83,
                  height: 45,
                  top: keyboardStatus
                    ? 0
                    : Platform.OS === "android"
                    ? -20.5
                    : -14,
                }}
              />
            ) : (
              <Image
                source={icons.bottomDefault.profile}
                resizeMode="contain"
                style={{
                  width: 23,
                  height: 23,
                  top: scaledVertical(Platform.OS === "android" ? -17 : -2),
                }}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
