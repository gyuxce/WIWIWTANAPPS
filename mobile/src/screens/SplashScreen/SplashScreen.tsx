import { CommonActions, useNavigation } from "@react-navigation/core";
import Space from "components/Space";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import { usePersist } from "hooks/usePersist";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { useDispatch } from "react-redux";
import { AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASSWORD, STATUS } from "@env";

import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import { wait } from "utils/Utils";
import "../../i18n/index";

const SplashScreen = () => {
  const { isNewInstall } = usePersist();
  const { auth, getMe, postSignin } = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    const resetToHomeScreen = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        }),
      );
    };

    const resetToInitialScreen = () => {
      if (isNewInstall) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "LandingScreen" }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "GuestScreen" }],
          }),
        );
      }
    };

    const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number) =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          setTimeout(() => reject(new Error("Auto login timeout")), timeoutMs);
        }),
      ]);

    const tryAutoLogin = async () => {
      const autoLoginEmail = AUTO_LOGIN_EMAIL;
      const autoLoginPassword = AUTO_LOGIN_PASSWORD;

      if (
        STATUS === "PRODUCTION" ||
        !autoLoginEmail ||
        !autoLoginPassword
      ) {
        console.log("[QA auto-login] disabled", {
          status: STATUS,
          hasEmail: Boolean(autoLoginEmail),
          hasPassword: Boolean(autoLoginPassword),
        });
        return false;
      }

      try {
        const signinResp = await withTimeout(
          postSignin({
            email: autoLoginEmail,
            password: autoLoginPassword,
            is_mobile: "1",
          }),
          8000,
        );
        const accessToken = signinResp?.data?.access_token;
        const refreshToken = signinResp?.data?.refresh_token;

        if (signinResp?.status !== "success" || !accessToken) {
          console.log("[QA auto-login] sign-in failed", signinResp?.status);
          return false;
        }

        const meResp = await withTimeout(
          getMe(accessToken, {
            accessToken,
            refreshToken,
          }),
          8000,
        );

        if (meResp?.status === "success") {
          console.log("[QA auto-login] signed in");
          resetToHomeScreen();
          return true;
        }
      } catch (error) {
        console.log("[QA auto-login] skipped", error);
        return false;
      }

      return false;
    };

    if (auth?.accessToken) {
      getMe(auth?.accessToken, auth).then(({ status }) => {
        if (status === "success") {
          resetToHomeScreen();
        } else {
          ErrorStatus(401, dispatch);
        }
      });
    } else {
      i18n.changeLanguage("id");
      wait(500).then(async () => {
        const isLoggedIn = await tryAutoLogin();
        if (!isLoggedIn) {
          resetToInitialScreen();
        }
      });
    }
  }, []);

  return (
    <View
      style={[
        globalStyles('#FFFFFF').topSafeArea,
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Image
        source={images.logoLong2}
        style={{
          width: '80%',
          aspectRatio: 1.6,
          resizeMode: 'contain',
        }}
      />
      <Space height={5} />
    </View>
  );
};

export default SplashScreen;
