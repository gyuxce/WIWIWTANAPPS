import React, { useEffect, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";

import { apiFCMPost } from "services/UserService";
import { useAuth } from "hooks/useAuth";

const messaging = getMessaging(getApp());

const FCMManager = () => {
  const fcmToken = useRef(null) as any;
  const errFcm = useRef(null) as any;
  const { auth, user } = useAuth();

  async function requestUserPermission() {
    const authStatus = await requestPermission(messaging, {
      alert: true,
      badge: true,
      sound: true,
      criticalAlert: true,
    });

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  useEffect(() => {
    if (Platform.OS === "ios") {
      requestUserPermission();
    }
    if (Platform.OS === "android") {
      PermissionsAndroid.request("android.permission.POST_NOTIFICATIONS");
    }
    getToken(messaging)
      .then(x => {
        if (x) {
          fcmToken.current = x;
          console.log("data token", x, fcmToken?.current);
          if (auth?.accessToken) {
            apiFCMPost(auth?.accessToken, x, user?.id);
          }
          // api
          //   .saveFCMToken(token, x)
          //   .then(res => {
          //     window.console.log("ini token", res.data, x);
          //   })
          //   .catch(err => {
          //     console.log("ada error:", err);
          //   });
        }
      })
      .catch(e => {
        errFcm.current = e;
      });

    const unsubscribe = onMessage(messaging, async remoteMessage => {
      console.log("FCM Message Data:", remoteMessage.data);
    });

    return unsubscribe;
  }, [errFcm, fcmToken]);

  return <></>;
};

export default FCMManager;
