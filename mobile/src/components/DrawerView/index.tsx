import {
  CommonActions,
  DrawerActions,
  useNavigation,
} from "@react-navigation/core";

import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import { useApp } from "hooks/useApp";
import { useAuth } from "hooks/useAuth";
import { useConstant } from "hooks/useConstant";
import { usePayment } from "hooks/usePayment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { onChangeRoute } from "stores/app/appSlice";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import "../../i18n/index";
import { useExam } from "hooks/useExam";

interface DrawerViewProps {}
const DrawerView = ({}: DrawerViewProps) => {
  const routes = [
    "PraTestScreen",
    "PaymentAdministration",
    "TrainingScreen",
    "JapanCertificateScreen",
    "FinalInterviewScreen",
  ];
  const { user, auth } = useAuth();
  const dispatch = useDispatch();
  const { getSettingAdmin } = useConstant();
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const { paymentStatusType, getPaymentStatusType } = usePayment();
  const { routeName, setRouteName } = useApp();
  const { trainingModuleProgress, getTrainingModuleProgress } = useExam();
  const [isOpen, setIsOpen] = useState(
    routes.includes(routeName) ? true : false,
  );

  useEffect(() => {
    setIsOpen(routes.includes(routeName) ? true : false);
    if (auth?.accessToken) {
      getPaymentStatusType();
      getTrainingModuleProgress();
      getSettingAdmin();
    }
  }, [routeName]);

  const dataDrawer = [
    {
      title: t("beranda"),
      selectedIcon: icons.bottomSelected.home,
      icon: icons.bottomDefault.home,
      type: "button",
      id: "HomeScreen",
      onPress: () => onPressNavigation("HomeScreen"),
    },
    {
      title: t("progress_pelatihan"),
      selectedIcon: icons.bottomSelected.progress,
      icon: icons.bottomDefault.progress,
      type: "dropdown",
      id: "Progress",
      item: [
        {
          title: t("fase_pratest"),
          selectedIcon: icons.bottomSelected.home,
          icon: icons.bottomDefault.home,
          type: "button",
          id: "PraTestScreen",
          onPress: () => onPressNavigation("PraTestScreen"),
          phase: 1,
        },
        {
          title: t("fase_pembayaran"),
          selectedIcon: icons.bottomSelected.home,
          icon: icons.bottomDefault.home,
          type: "button",
          id: "PaymentAdministration",
          onPress: () => onPressNavigation("PaymentAdministration"),
          phase: 2,
        },
        {
          title: t("fase_pelatihan"),
          selectedIcon: icons.bottomSelected.home,
          icon: icons.bottomDefault.home,
          type: "button",
          id: "TrainingScreen",
          onPress: () => onPressNavigation("TrainingScreen"),
          phase: 3,
        },
        {
          title: t("fase_sertifikasi"),
          selectedIcon: icons.bottomSelected.home,
          icon: icons.bottomDefault.home,
          type: "button",
          id: "JapanCertificateScreen",
          onPress: () => onPressNavigation("JapanCertificateScreen"),
          phase: 4,
        },
        {
          title: t("fase_wawancara"),
          selectedIcon: icons.bottomSelected.home,
          icon: icons.bottomDefault.home,
          type: "button",
          id: "FinalInterviewScreen",
          onPress: () => onPressNavigation("FinalInterviewScreen"),
          phase: 5,
        },
      ],
      //onPress: () => onPressNavigation("HomeScreen"),
    },
    {
      title: t("forum"),
      selectedIcon: icons.bottomSelected.chat,
      icon: icons.bottomDefault.chat,
      type: "button",
      id: "ForumScreen",
      onPress: () => onPressNavigation("ForumScreen"),
    },
    {
      title: t("dokumen_saya"),
      selectedIcon: icons.bottomSelected.document,
      icon: icons.bottomDefault.document,
      type: "button",
      id: "DocumentScreen",
      onPress: () => onPressNavigation("DocumentScreen"),
    },
    {
      title: t("profil"),
      selectedIcon: icons.bottomSelected.profile,
      icon: icons.bottomDefault.profile,
      type: "button",
      id: "ProfileScreen",
      onPress: () => onPressNavigation("ProfileScreen"),
    },
  ];

  const onPressNavigation = (route: string) => {
    setRouteName(route);
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }, { name: route }],
      }),
    );
  };

  const colorBackground = (index: number, route: string) => {
    if (index === 1 && user?.last_phase === 2) {
      if (user?.join_reason === null) {
        return colors.stone200;
      }
      if (
        paymentStatusType?.is_administration_payment_completed &&
        paymentStatusType?.is_training_payment_completed
      ) {
        return colors.green50;
      } else {
        return "transparent";
      }
    } else {
      if (
        index === 2 &&
        paymentStatusType?.is_administration_payment_completed &&
        paymentStatusType?.is_training_payment_completed &&
        isAllAssesmentCompleted()
      ) {
        return colors.green50;
      }
      if (route === routeName) {
        return colors.white;
      } else if (index + 1 > user?.last_phase) {
        return colors.stone200;
      } else if (index + 1 === user?.last_phase) {
        return "transparent";
      } else {
        return colors.green50;
      }
    }
  };

  const isAllAssesmentCompleted = () => {
    let data: boolean[] = [];
    trainingModuleProgress?.map(item => {
      if (item?.assesment_count - item?.assesment_count_progress === 0) {
        data?.push(true);
      } else {
        data?.push(false);
      }
    });

    return data?.every(item => item === true);
  };

  const showIcon = (index: number, route: string) => {
    if (index === 1 && user?.last_phase === 2) {
      if (user?.join_reason === null) {
        return { icon: icons.lock, isShow: true };
      }
      if (
        paymentStatusType?.is_administration_payment_completed &&
        paymentStatusType?.is_training_payment_completed
      ) {
        return { icon: icons.successGreen, isShow: true };
      } else {
        return { icon: null, isShow: false };
      }
    } else {
      if (
        index === 2 &&
        paymentStatusType?.is_administration_payment_completed &&
        paymentStatusType?.is_training_payment_completed &&
        isAllAssesmentCompleted()
      ) {
        return { icon: icons.successGreen, isShow: true };
      }
      if (route === routeName) {
        return { icon: null, isShow: false };
      } else if (index + 1 > user?.last_phase) {
        return { icon: icons.lock, isShow: true };
      } else if (index + 1 === user?.last_phase) {
        return { icon: null, isShow: false };
      } else {
        return { icon: icons.successGreen, isShow: true };
      }
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.stone100,
          flex: 1,
          paddingHorizontal: scaledHorizontal(25),
          paddingTop:
            Platform.OS === "android"
              ? useSafeAreaInsets().top === 0
                ? scaledVertical(25)
                : useSafeAreaInsets().top
              : useSafeAreaInsets().top,
        },
      ]}
    >
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => {
          dispatch(onChangeRoute("ProfileScreen"));
          navigation.navigate("ProfileScreen");
        }}
      >
        <View style={styles.containerName}>
          <View style={styles.containerImage}>
            <Image
              source={
                user?.profilePicture
                  ? { uri: user?.profilePicture.url }
                  : images.userDefault
              }
              style={styles.imageAvatar}
            />
          </View>
        </View>
        <View
          style={{
            marginLeft: scaledHorizontal(15),
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{ width: "90%" }}
            color={colors.red}
            size={16}
            numberOfLines={1}
            type="bold"
            variant={"CenturyGothicBold"}
          >
            {user?.name}
          </Text>
          <Space height={1} />
          <Text color={colors.accent} size={12}>
            {user?.name_alias || "-"}
          </Text>
        </View>
      </TouchableOpacity>
      <Space height={40} />
      <ScrollView>
        {dataDrawer.map((item, index) => {
          return item.type === "button" ? (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: scaledHorizontal(10),
                paddingVertical: scaledVertical(15),
                paddingHorizontal: scaledHorizontal(10),
                borderWidth: routeName === item.id ? 1 : 0,
                backgroundColor:
                  routeName === item.id ? colors.white : "transparent",
                borderRadius: 8,
              }}
            >
              <Image
                source={routeName === item.id ? item.selectedIcon : item.icon}
                style={{ height: 24, width: 24, resizeMode: "contain" }}
              />
              <Text
                size={14}
                type={routeName === item.id ? "bold" : "reguler"}
                variant={
                  routeName === item.id
                    ? "CenturyGothicBold"
                    : "CenturyGothicRegular"
                }
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <View key={index}>
              <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={{
                  alignItems: "center",
                  gap: 10,
                  marginTop: scaledHorizontal(10),
                  paddingVertical: scaledVertical(15),
                  paddingHorizontal: scaledHorizontal(10),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: routes.includes(routeName)
                    ? colors.white
                    : "transparent",
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={
                      routes.includes(routeName) ? item.selectedIcon : item.icon
                    }
                    style={{ height: 24, width: 24, resizeMode: "contain" }}
                  />
                  <Text size={14}>{item.title}</Text>
                </View>
                <Image
                  source={isOpen ? icons.arrowBottom : icons.arrowUp}
                  style={{ height: 24, width: 24, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              {item.item?.map((itm, index) => {
                return isOpen ? (
                  <TouchableOpacity
                    onPress={itm.onPress}
                    disabled={index + 1 > user?.last_phase}
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginLeft: scaledHorizontal(10),
                      marginTop: scaledHorizontal(10),
                      paddingVertical: scaledVertical(15),
                      paddingHorizontal: scaledHorizontal(15),
                      borderWidth: itm.id === routeName ? 1 : 0,
                      backgroundColor: colorBackground(index, itm.id),
                      borderRadius: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      size={14}
                      style={{
                        color:
                          index + 1 === 2 && user?.join_reason === null
                            ? colors.stone500
                            : index + 1 > user?.last_phase
                            ? colors.stone500
                            : colors.black,
                        fontWeight: itm.id === routeName ? "900" : "400",
                        flex: 1,
                      }}
                    >
                      {itm.title}
                    </Text>
                    {showIcon(index, itm.id).isShow && (
                      <Image
                        source={showIcon(index, itm.id).icon}
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: "contain",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          );
        })}
      </ScrollView>

      <Text textAlign="center" size={12} color={colors.stone400}>
        Version {DeviceInfo.getVersion()}
      </Text>
      <Space height={40} />
    </View>
  );
};

export default DrawerView;

const styles = StyleSheet.create({
  imageAvatar: {
    height: 41,
    width: 41,
    resizeMode: "contain",
    borderRadius: 40 / 2,
  },
  containerName: {
    height: 52,
    width: 52,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 52 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    padding: 2,
  },
  containerImage: {
    height: 46,
    width: 46,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 46 / 2,

    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
