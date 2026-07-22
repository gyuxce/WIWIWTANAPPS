import { CommonActions, useNavigation } from "@react-navigation/core";
import Space from "components/Space";
import images from "configs/images";
import { useAuth } from "hooks/useAuth";
import { usePersist } from "hooks/usePersist";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Image } from "react-native";
import { useDispatch } from "react-redux";

import { ErrorStatus } from "utils/ErrorStatus";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { wait } from "utils/Utils";
import "../../i18n/index";

const SplashScreen = () => {
  const { isNewInstall } = usePersist();
  const { auth, getMe } = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (auth?.accessToken) {
      getMe(auth?.accessToken, auth).then(({ status }) => {
        if (status === "success") {
          NavigationService.replace("HomeScreen");
        } else {
          ErrorStatus(401, dispatch);
        }
      });
    } else {
      i18n.changeLanguage("id");
      wait(500).then(() => {
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
