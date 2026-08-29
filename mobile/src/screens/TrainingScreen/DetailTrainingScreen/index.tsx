import { ActivityIndicator, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import images from "configs/images";
import colors from "configs/colors";
import Space from "components/Space";
import CardProgressProfile from "components/CardProgressProfile";
import type { RouteProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/core";
import type { RootStackParamList } from "types/NavigatorTypes";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "hooks/useAuth";
import { getCourseImageAndColor } from "utils/Utils";
import { useTraining } from "hooks/useTraining";
import moment from "moment";
import NavigationService from "utils/NavigationService";
import { useExam } from "hooks/useExam";
import { t } from "i18next";
import Section from "components/Section";

import Module from "./Modul";
import Asesmen from "./Asesmen";
import VirtualClass from "./VirtualClass";
import styles from "./styles";
import TabItem from "./TabItem";

type VerifyURLRouteType = RouteProp<RootStackParamList, "DetailTrainingScreen">;

type VerifyURLNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DetailTrainingScreen"
>;

type Prop = {
  route: VerifyURLRouteType;
  navigation: VerifyURLNavigationProp;
};
const DetailTraininScreen = ({ route }: Prop) => {
  const {
    getVirtualClassList,
    virtualClassList,
    getVirtualClassNoFilter,
    virtualClassNoFilter,
    getAssesmentListNoFilter,
    assesmentListNoFilter,
  } = useTraining();

  const { trainingModuleProgress, getTrainingModuleProgress } = useExam();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();
  const toSafeNumber = (value?: number | string | null) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const selectedCourseProgress =
    trainingModuleProgress?.find(
      item => item.id === route?.params?.categoryCourse?.id,
    ) || route?.params?.categoryCourse;
  const moduleProgress = toSafeNumber(
    selectedCourseProgress?.materi_count_progress,
  );
  const moduleTotal = toSafeNumber(selectedCourseProgress?.materi_count);
  const courseProgress =
    moduleProgress +
    toSafeNumber(selectedCourseProgress?.virtual_count_progress) +
    toSafeNumber(selectedCourseProgress?.assesment_count_progress);
  const courseTotal =
    moduleTotal +
    toSafeNumber(selectedCourseProgress?.virtual_count) +
    toSafeNumber(selectedCourseProgress?.assesment_count);

  const checkVirtualClassList = () => {
    return (virtualClassNoFilter || []).reduce((total, item) => {
      return total + (item?.classVirtual?.length || 0);
    }, 0);
  };

  const checkInactiveVirtualClass = () => {
    return (virtualClassNoFilter || []).reduce((total, item) => {
      return (
        total +
        (item?.classVirtual || []).filter(item =>
          moment(item?.event?.started_at).isBefore(new Date()),
        ).length
      );
    }, 0);
  };

  const checkAssesmentList = () => {
    return (assesmentListNoFilter || []).reduce((total, item) => {
      return total + (item?.assesment?.length || 0);
    }, 0);
  };

  const checkInactiveAssesmentList = () => {
    return (assesmentListNoFilter || []).reduce((total, item) => {
      return (
        total +
        ((item?.assesment || []).filter(
          item =>
            item?.assesmentStudent?.status === 1 ||
            item?.assesmentStudent?.status === 3,
        ).length || 0)
      );
    }, 0);
  };

  const tabList = [
    {
      title: t("modul"),
      progress: moduleProgress,
      total: moduleTotal,
    },
    {
      title: t("kelas_virtual"),
      progress: checkInactiveVirtualClass(),
      total: checkVirtualClassList(),
    },
    {
      title: t("asesmen"),
      progress: checkInactiveAssesmentList() || 0,
      total: checkAssesmentList() || 0,
    },
  ];

  const fetchData = async () => {
    await Promise.all([
      getVirtualClassList(route?.params?.categoryCourse?.id, ""),
      getVirtualClassNoFilter(route?.params?.categoryCourse?.id, ""),
      getAssesmentListNoFilter(route?.params?.categoryCourse?.id),
    ]);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([getTrainingModuleProgress(), fetchData()]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_subscription_active !== 1) {
      NavigationService.replace("InstallmentPaymentDetailScreen", {
        price_type: 2,
      });
    }

    loadData();
    const unsubscribe = navigation.addListener("focus", loadData);

    return unsubscribe;
  }, []);

  const renderLoadingOverlay = () => {
    if (!isLoading) {
      return null;
    }

    return (
      <View style={styles.loadingOverlay} pointerEvents="auto">
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Header
        withBell
        totalNotification={4}
        textJapan="トレーニング"
        textTitle="Pelatihan"
        withTextTitle
        withBackButton
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wrapImg}>
            <Image
              source={
                route?.params?.categoryCourse?.cover === null
                  ? getCourseImageAndColor(
                      route?.params?.categoryCourse?.type_label,
                    )?.image
                  : { uri: route?.params?.categoryCourse?.cover?.url }
              }
              style={{ height: "100%", width: "100%" }}
              resizeMode="contain"
            />
          </View>
          <Space height={12} />
          <Section
            textJapan={route?.params?.categoryCourse?.title_japan}
            textTitle={route?.params?.categoryCourse?.title}
            size={20}
          />
          {/* <Text size={20} variant="CenturyGothicRegular" textAlign="center">
            {route?.params?.categoryCourse?.title}
          </Text> */}
          <Space height={20} />

          <CardProgressProfile
            image={
              user?.profilePicture?.url
                ? { uri: user?.profilePicture?.url }
                : images.userDefault
            }
            total={courseTotal}
            progress={courseProgress}
            color={
              getCourseImageAndColor(route?.params?.categoryCourse?.type_label)
                ?.color
            }
            name={user?.name}
            nameJapan={user?.name_alias}
          />
          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 12 }}
          >
            {tabList.map((item, i) => (
              <TabItem
                key={i.toString()}
                title={item.title}
                progress={item.progress}
                total={item.total}
                isSelected={i === selectedTab}
                onPress={() => setSelectedTab(i)}
              />
            ))}
          </View>

          {/* {selectedTab > 0 && (
            <View style={styles.wrapSearch}>
              <TextInput
                value={searchValue}
                onChange={setSearchValue}
                textStyle={styles.input}
                iconLeft={icons.search}
                iconLeftStyle={{ width: 16, height: 16, marginLeft: 10 }}
                stylesBox={styles.inputBox}
                placeholder="Cari"
              />
              <Button
                withBorder={false}
                title="Filter"
                icon={icons.filter}
                iconStyle={{ width: 16, height: 16, marginRight: 6 }}
                fontSize={10}
                textType="bold"
                variant="CenturyGothicBold"
                style={styles.filter}
                innerStyle={{ alignItems: "center" }}
              />
            </View>
          )} */}

          {selectedTab === 1 && (
            <>
              <Space height={12} />
              <View style={{ gap: 12 }}>
                <VirtualClass
                  virtualClassList={virtualClassList}
                  categoryId={route?.params?.categoryCourse?.id}
                />
              </View>
            </>
          )}

          {selectedTab === 2 && (
            <>
              <Space height={12} />
              <Asesmen
                categoryId={route?.params?.categoryCourse?.id}
                icon={
                  route?.params?.categoryCourse?.cover === null
                    ? getCourseImageAndColor(
                        route?.params?.categoryCourse?.type_label,
                      )?.image
                    : { uri: route?.params?.categoryCourse?.cover?.url }
                }
              />
            </>
          )}

          {selectedTab === 0 && (
            <>
              <Space height={12} />
              <Module
                categoryId={route?.params?.categoryCourse?.id}
                title={route?.params?.categoryCourse?.title}
                image={
                  route?.params?.categoryCourse?.cover === null
                    ? getCourseImageAndColor(
                        route?.params?.categoryCourse?.type_label,
                      )?.image
                    : { uri: route?.params?.categoryCourse?.cover?.url }
                }
              />
            </>
          )}

          <Space height={50} />
        </ScrollView>
      </View>
      {renderLoadingOverlay()}
    </View>
  );
};

export default DetailTraininScreen;
