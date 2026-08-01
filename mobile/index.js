/**
 * @format
 */
import { AppRegistry } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

import App from "./App";
import { name as appName } from "./app.json";

const debugLog = (...args) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

try {
  setBackgroundMessageHandler(getMessaging(getApp()), async remoteMessage => {
    debugLog("Background message received", remoteMessage?.messageId);
  });
  debugLog("FCM background handler registered");
} catch (err) {
  debugLog("Failed to register FCM background handler", err);
}

AppRegistry.registerComponent(appName, () => App);
