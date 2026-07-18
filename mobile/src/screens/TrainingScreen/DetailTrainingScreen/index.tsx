import { View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import images from "configs/images";
import Space from "components/Space";
import CardProgressProfile from "components/CardProgressProfile";
import TabItem from "./TabItem";
import styles from "./styles";
import VirtualClass from "./VirtualClass";
import Asesmen from "./Asesmen";
import Module from "./Modul";
import { RouteProp, useNavigation } from "@react-navigation/core";
import type { RootStackParamList } from "types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "hooks/useAuth";
import { getCourseImageAndColor } from "utils/Utils";
import { useTraining } from "hooks/useTraining";
import moment from "moment";
import NavigationService from "utils/NavigationService";
import { useExam } from "hooks/useExam";
import { t } from "i18next";
import Section from "components/Section";

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
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (user?.is_subscription_active !== 1) {
      NavigationService.replace("InstallmentPaymentDetailScreen", {
        price_type: 2,
      });
    }
    navigation.addListener("focus", e => {
      getTrainingModuleProgress();
      fetchData();
    });
  }, []);

  const checkVirtualClassList = () => {
    return virtualClassNoFilter?.reduce((total, item) => {
      return total + item.classVirtual.length;
    }, 0);
  };

  const checkInactiveVirtualClass = () => {
    return virtualClassNoFilter?.reduce((total, item) => {
      return (
        total +
        item.classVirtual.filter(item =>
          moment(item?.event?.started_at).isBefore(new Date()),
        ).length
      );
    }, 0);
  };

  const checkAssesmentList = () => {
    return assesmentListNoFilter?.reduce((total, item) => {
      return total + (item.assesment.length || 0);
    }, 0);
  };

  const checkInactiveAssesmentList = () => {
    return assesmentListNoFilter?.reduce((total, item) => {
      return (
        total +
        (item.assesment.filter(
          item =>
            item.assesmentStudent?.status === 1 ||
            item.assesmentStudent?.status === 3,
        ).length || 0)
      );
    }, 0);
  };

  const tabList = [
    {
      title: t("modul"),
      progress:
        trainingModuleProgress?.filter(
          item => item.id === route?.params?.categoryCourse?.id,
        )?.[0]?.materi_count_progress || 0,
      total:
        trainingModuleProgress?.filter(
          item => item.id === route?.params?.categoryCourse?.id,
        )?.[0]?.materi_count || 0,
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
    getVirtualClassList(route?.params?.categoryCourse?.id, "");
    getVirtualClassNoFilter(route?.params?.categoryCourse?.id, "");
    getAssesmentListNoFilter(route?.params?.categoryCourse?.id);
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
            total={
              //@ts-ignore
              trainingModuleProgress?.filter(
                item => item.id === route?.params?.categoryCourse?.id,
              )?.[0]?.materi_count +
              virtualClassNoFilter?.reduce((total, item) => {
                return total + item.classVirtual.length;
              }, 0) +
              assesmentListNoFilter?.reduce((total, item) => {
                return total + item.assesment.length;
              }, 0)
            }
            progress={
              //@ts-ignore
              trainingModuleProgress?.filter(
                item => item.id === route?.params?.categoryCourse?.id,
              )?.[0]?.materi_count_progress +
              +virtualClassNoFilter?.reduce((total, item) => {
                return total + item.classVirtual.length;
              }, 0) +
              assesmentListNoFilter?.reduce((total, item) => {
                return (
                  total +
                  item.assesment.filter(
                    item =>
                      item?.assesmentStudent?.status === 1 ||
                      item?.assesmentStudent?.status === 3,
                  ).length
                );
              }, 0)
            }
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
    </View>
  );
};

export default DetailTraininScreen;
