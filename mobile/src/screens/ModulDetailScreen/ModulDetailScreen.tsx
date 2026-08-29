import Card from "components/Card";
import Header from "components/Header";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, ScrollView, View } from "react-native";
import TabItem from "screens/TrainingScreen/DetailTrainingScreen/TabItem";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import type { RouteProp } from "@react-navigation/core";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTraining } from "hooks/useTraining";
import type { AssesmentTypeResponse } from "types/TrainingTypes";
import { t } from "i18next";

import Assesment from "./Assesment/Assesment";
import Materi from "./Materi/Materi";

type ModulDetailRouteType = RouteProp<RootStackParamList, "ModulDetailScreen">;

type ModulDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ModulDetailScreen"
>;

type Prop = {
  route: ModulDetailRouteType;
  navigation: ModulDetailNavigationProp;
};

const ModulDetailScreen = ({ route }: Prop) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    materiDetail,
    getMateriDetail,
    assesmentListNoFilter,
    getAssesmentListNoFilter,
  } = useTraining();

  const isFocused = useIsFocused();

  const [query, setQuery] = useState({
    search: "",
    sort: { id: 2, title: t("belum_selesai") },

    filter: [
      { id: 2, title: t("belum_dimulai") },
      { id: 1, title: t("selesai") },
    ],
    type: [
      { id: 1, title: t("video") },
      { id: 2, title: t("dokumen") },
      { id: 3, title: t("presentasi") },
    ],
  });

  const sortList = [
    { id: 1, title: t("selesai") },
    { id: 2, title: t("belum_selesai") },
  ];

  const filterList = [
    { id: 2, title: t("belum_dimulai") },
    { id: 1, title: t("selesai") },
  ];

  const typeList = [
    { id: 1, title: t("video") },
    { id: 2, title: t("dokumen") },
    { id: 3, title: t("materi") },
  ];
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [370], []);
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    navigation.addListener("focus", e => {
      initData();
    });
  }, []);

  const initData = useCallback(() => {
    getMateriDetail({
      type: "pagination",
      options: [
        [`filter,uuid,equal,${route?.params?.materiId}`],
        [`search,materialContent.title,${query?.search}`],
        //[`filter,assesment.group,equal,3`],
      ],

      relations: [
        "materialContent.file",
        "materialContent.cover",
        "materialContent.userArticle",
        // "assesment.exam_template",
        // "assesment.file",
        // "assesment.assesmentStudent",
        // "assesment.assesmentStudentHistory",
      ],
    });
    getAssesmentListNoFilter(route?.params?.categoryId);
  }, [isFocused]);

  const checkActiveAssesmentList = () => {
    return assesmentListNoFilter
      ?.filter(
        item =>
          item?.title === route?.params?.title &&
          item?.level_module_label === route?.params?.type_label,
      )
      .reduce((total, item) => {
        return (
          total +
          item.assesment.filter(item => item.assesmentStudent !== null).length
        );
      }, 0);
  };

  // Derive the materi counter from the freshly-fetched list rather than the
  // navigation param it was passed in with. The param only ever changed when
  // ContentDetailScreen incremented it on the way back, so anything that
  // completes a material another way -- reading a PDF in PdfViewerScreen, for
  // instance -- left the header showing a stale count even though the card
  // below it already said "Selesai". Falls back to the param while the list
  // is still loading.
  const materiCompleted = materiDetail?.filter(
    item => item?.progress?.status === 1,
  ).length;
  const hasMateriData = (materiDetail?.length || 0) > 0;

  const tabList = [
    {
      title: t("materi"),
      progress: hasMateriData
        ? Number(materiCompleted || 0)
        : Number(route?.params?.materiProgress),
      total: hasMateriData
        ? Number(materiDetail?.length || 0)
        : Number(route?.params?.materiTotal),
    },
    {
      title: t("asesmen"),
      progress: Number(checkActiveAssesmentList() || 0),
      total: Number(
        assesmentListNoFilter?.filter(
          item =>
            item?.title === route?.params?.title &&
            item?.level_module_label === route?.params?.type_label,
        )[0]?.assesment.length || 0,
      ),
    },
  ];

  const overallProgress = tabList.reduce(
    (sum, tab) => sum + (Number(tab.progress) || 0),
    0,
  );
  const overallTotal = tabList.reduce(
    (sum, tab) => sum + (Number(tab.total) || 0),
    0,
  );

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
      <Space height={8} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          //@ts-ignore
          source={route?.params?.image}
          style={{ height: 80, width: 64, alignSelf: "center" }}
          resizeMode="contain"
        />
        <Space height={10} />
        <View
          style={{
            alignSelf: "center",
            paddingHorizontal: scaledHorizontal(10),
            paddingVertical: scaledVertical(10),
            borderWidth: 1,
            borderColor: colors.black,
            borderRadius: 8,
          }}
        >
          <Text size={16} type="reguler" variant="OpificioNeueRegular">
            {/*
             * Reuses the same numbers the tabs show, so header and tabs can
             * never disagree. The previous version added `materiProgress`
             * (typed as a string) to a number, which is string concatenation
             * in JS -- "1" + 2 becomes "12", not 3 -- so the percentage could
             * be wildly wrong depending on what the params happened to hold.
             */}
            {overallTotal > 0
              ? ((overallProgress / overallTotal) * 100).toFixed()
              : "0"}
            <Text size={10} variant="CenturyGothicRegular">
              %
            </Text>
          </Text>
        </View>
        <Space height={15} />
        <View
          style={{
            alignSelf: "center",
            paddingHorizontal: scaledHorizontal(10),
            paddingVertical: scaledVertical(10),
            backgroundColor: colors.red,
            borderRadius: 8,
          }}
        >
          <Text
            size={16}
            type="bold"
            variant="CenturyGothicBold"
            color={colors.white}
          >
            {route?.params?.level}
          </Text>
        </View>
        <Space height={15} />

        <Text size={20} variant="CenturyGothicRegular" textAlign="center">
          {route?.params?.materiTitle}
        </Text>
        <Space height={20} />
        <Card
          style={{
            marginHorizontal: scaledHorizontal(25),
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
        >
          {route?.params?.breadCrumb &&
            route?.params?.breadCrumb.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flex: item?.isActive ? 1 : 0.8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    size={10}
                    style={{
                      fontWeight:
                        route?.params?.breadCrumb.length - 1 !== index
                          ? "400"
                          : "900",
                    }}
                    color={item?.isActive ? colors.accent : colors.stone500}
                  >
                    {item.title}
                  </Text>
                  {route?.params?.breadCrumb.length - 1 !== index && (
                    <Image
                      source={icons.arrowRight2}
                      style={{ height: 12, width: 12, resizeMode: "contain" }}
                    />
                  )}
                </View>
              );
            })}
        </Card>
        <Space height={10} />
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginBottom: 12,
            marginHorizontal: scaledHorizontal(25),
          }}
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
        <Space height={10} />
        {selectedTab === 0 && (
          <Materi
            params={route?.params}
            query={query}
            setQuery={setQuery}
            sortList={sortList}
            filterList={filterList}
            typeList={typeList}
            actionSheetRef={actionSheetRef}
            snapPoints={snapPoints}
            materiDetail={materiDetail}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}

        {selectedTab === 1 && (
          <Assesment
            data={
              assesmentListNoFilter.filter(
                item =>
                  item.title === route?.params?.title &&
                  item.level_module_label === route?.params?.type_label,
              )[0] || ({} as AssesmentTypeResponse)
            }
            //@ts-ignore
            icon={route?.params?.image}
          />
        )}

        <Space height={100} />
      </ScrollView>
    </View>
  );
};

export default ModulDetailScreen;
