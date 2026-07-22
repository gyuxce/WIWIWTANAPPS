import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import icons from "configs/icons";
import { useExam } from "hooks/useExam";
import SortActionSheet from "components/SortActionSheet";
import { scaledHorizontal } from "utils/ScaledService";
import Space from "components/Space";
import Button from "components/Button";
import SearchAndSort from "components/SearchAndSort";
import styles from "./style";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Text from "components/Text";
import NavigationService from "utils/NavigationService";
import { useIsFocused } from "@react-navigation/core";
import { t } from "i18next";

const getDisplayTitle = (item?: { title?: string; title_japan?: string }) =>
  item?.title_japan || item?.title || "";

interface Props {
  categoryId: string;
  title: string;
  image: any;
}
const Module = ({ categoryId, title, image }: Props) => {
  const [q, setQ] = useState("");
  const [data, setData] = useState([] as any);
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [320], []);
  const dataSort = [
    { id: "asc", title: t("level_tertinggi") },
    { id: "desc", title: t("level_terendah") },
  ];
  const [selectedSort, setSelectedSort] = useState(
    dataSort[0] as { id: string; title: string },
  );
  const dataFilter = [
    { id: "2", title: t("belum_dimulai") },
    { id: "1", title: t("selesai") },
  ];
  const isFocused = useIsFocused();
  const [selectedFilter, setSelectedFilter] = useState(["2", "1"] as string[]);
  const { getModuleDetail } = useExam();
  const toggleContentVisibility = (index: number) => {
    const newData = [...data];
    newData[index].isOpen = !newData[index].isOpen;
    setData(newData);
  };
  const openChild = (index: number, iChild: string | number) => {
    const newData = [...data];
    newData[index].child[iChild].isOpen = !newData[index].child[iChild].isOpen;
    setData(newData);
  };
  useEffect(() => {
    fetchData();
  }, [isFocused]);
  const fetchData = async (sort = selectedSort, keyword = q) => {
    let status = "";
    if (selectedFilter.length < 2) {
      status = selectedFilter[0] ?? "";
    }
    getModuleDetail({
      category_id: categoryId,
      sort_by: sort?.id,
      status: status,
      keyword: keyword,
    }).then(({ data }) => {
      setData(data);
    });
  };
  const filterModule = (sort = selectedSort, keyword?: string) => {
    fetchData(sort, keyword);
  };
  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={fetchData} />
        }
      >
        <SearchAndSort
          search={q}
          setSearch={val => {
            setQ(val);
            filterModule(selectedSort, val);
          }}
          actionSheetRef={actionSheetRef}
          btnText={t("filter")}
          placeholder={t("cari")}
          marginHorizontal={scaledHorizontal(0)}
        />
        <Space height={10} />
        {data.length > 0 ? (
          <View>
            {data.map((item: any, index: number) => (
              <View key={index} style={styles.moduleContainer}>
                <View style={styles.mainContentContainer}>
                  <TouchableOpacity
                    onPress={() => toggleContentVisibility(index)}
                  >
                    <View style={styles.rowContainer}>
                      <Text style={styles.mainTitle}>
                        {getDisplayTitle(item)}
                      </Text>
                      <View style={styles.rightContainer}>
                        <Text style={styles.totalTextRed}>
                          {item.total_finished} / {item.total}
                        </Text>
                        <Image
                          source={
                            item.isOpen ? icons.arrowBottom : icons.arrowRight2
                          }
                          style={styles.arrowIcon}
                        />
                      </View>
                    </View>
                    {item.isOpen && (
                      <Image source={icons.divider} style={styles.divider} />
                    )}
                  </TouchableOpacity>

                  {item.isOpen &&
                    item.child.map((child: any, i: number) => (
                      <View key={i} style={styles.childContentContainer}>
                        <TouchableOpacity onPress={() => openChild(index, i)}>
                          <View style={styles.rowContainer}>
                            <Text style={styles.childTitle}>
                              {getDisplayTitle(child)}
                            </Text>
                            <View style={styles.rightContainer}>
                              <Text style={styles.totalText}>
                                {child.total_finished}/ {child.total}
                              </Text>
                              <Image
                                source={
                                  child.isOpen
                                    ? icons.arrowBottom
                                    : icons.arrowRight2
                                }
                                style={styles.arrowIcon}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>

                        {child.isOpen &&
                          child.content?.map((content: any, ic: number) => (
                            <TouchableOpacity
                              onPress={() =>
                                NavigationService.navigate(
                                  "ModulDetailScreen",
                                  {
                                    level: item.level_module_label,
                                    materiTitle: getDisplayTitle(content),
                                    materiTitleJapan: content.title_japan,
                                    materiProgress: content.total_finished,
                                    materiTotal: content.total,
                                    materiId: content.id,
                                    categoryId: categoryId,
                                    title: child?.title,
                                    type_label: item?.level_module_label,
                                    breadCrumb: [
                                      { title: title, isActive: false },
                                      {
                                        title: getDisplayTitle(child),
                                        titleJapan: child.title_japan,
                                        isActive: false,
                                      },
                                      {
                                        title: getDisplayTitle(content),
                                        titleJapan: content.title_japan,
                                        isActive: true,
                                      },
                                    ],
                                    image: image,
                                  },
                                )
                              }
                              key={ic}
                              style={[
                                styles.contentContainer,
                                {
                                  backgroundColor: content.finished
                                    ? "#F5F5F4"
                                    : "white",
                                },
                              ]}
                            >
                              <View style={styles.rowContainer}>
                                <Image
                                  source={icons.book}
                                  style={styles.bookIcon}
                                />
                                {content.total != 0 &&
                                content.total_finished == content.total ? (
                                  <>
                                    <Text
                                      style={styles.finishedContentTitle}
                                      numberOfLines={1}
                                      //ellipsizeMode="tail"
                                    >
                                      {getDisplayTitle(content)}
                                    </Text>
                                    <Image
                                      source={icons.checklistGreen}
                                      style={styles.checklistIcon}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Text
                                      style={styles.contentTitle}
                                      numberOfLines={1}
                                      //ellipsizeMode="tail"
                                    >
                                      {getDisplayTitle(content)}
                                    </Text>
                                    <Text style={styles.totalText}>
                                      {content.total_finished} / {content.total}
                                    </Text>
                                  </>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text size={12} style={{ marginTop: 40 }} textAlign="center">
            Tidak ada course
          </Text>
        )}
      </ScrollView>

      <SortActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
          filterModule(sort);
        }}
        selectedSort={selectedSort}
      >
        <Space height={20} />
        <Text textAlign="center" type="bold" variant="CenturyGothicBold">
          Filter
        </Text>
        <Space height={10} />
        <View style={styles.filterWrapper}>
          {dataFilter.map((item, index) => {
            return (
              <Button
                key={index}
                onPress={() => {
                  let currentFilter = selectedFilter;
                  if (selectedFilter.includes(item?.id)) {
                    currentFilter = selectedFilter?.filter(
                      (i: string) => i !== item?.id,
                    );
                  } else {
                    currentFilter = [...selectedFilter, item?.id];
                  }
                  setSelectedFilter(currentFilter);
                }}
                title={item?.title}
                style={[
                  styles.buttonFilter,
                  {
                    borderWidth: selectedFilter.includes(item.id) ? 1 : 0,
                  },
                ]}
                textType="bold"
                variant="CenturyGothicBold"
                textStyle={styles.buttonTextFilter}
                withBorder={false}
              />
            );
          })}
        </View>
      </SortActionSheet>
    </View>
  );
};
export default Module;
