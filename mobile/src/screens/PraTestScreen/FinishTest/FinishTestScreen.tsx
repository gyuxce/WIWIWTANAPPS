import { useNavigation } from "@react-navigation/core";
import Button from "components/Button";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import fonts from "configs/fonts";
import images from "configs/images";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Image, BackHandler } from "react-native";
import { useDispatch } from "react-redux";
import { onChangeRoute } from "stores/app/appSlice";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";

const FinishTestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    const subscribe: any = navigation.addListener("beforeRemove", e => {
      if (e.data.action.type === "NAVIGATE") {
        navigation.dispatch(e.data.action);
      }
    });

    return () => {
      subscribe();
    };
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    dispatch(onChangeRoute("PraTestScreen"));
    NavigationService.navigate("PraTestScreen");
    return true;
  };
  return (
    <View style={globalStyles().topSafeArea}>
      <View
        style={{
          flex: 1,
          marginTop: 200,
          alignItems: "center",
        }}
      >
        <Image
          source={images.imagePerjalanan}
          style={{ width: 130, height: 105, resizeMode: "contain" }}
        />
        <Text
          size={48}
          type="reguler"
          variant="OpificioNeueRegular"
          color={colors.accent}
        >
          よく出来ました!
        </Text>
        <Space height={10} />
        <Text type="bold" variant="CenturyGothicBold">
          {t("tes_selesai")}
        </Text>
        <Space height={10} />
        <Text
          size={12}
          textAlign="center"
          style={{ paddingHorizontal: scaledHorizontal(60) }}
        >
          {t("announce_finish_tes")}
        </Text>
        <Space height={20} />
        <Button
          title={t("kembali_ke_prates")}
          style={{ paddingVertical: 12, minWidth: "80%" }}
          textType="bold"
          textStyle={{ fontFamily: fonts.CenturyGothicBold, fontWeight: "600" }}
          onPress={() => NavigationService.navigate("PraTestScreen")}
        />
      </View>
    </View>
  );
};

export default FinishTestScreen;
