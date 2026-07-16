import Card from "components/Card";
import MateriActionSheet from "components/MateriActionSheet";
import SearchAndSort from "components/SearchAndSort";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import { ResizeMode, Video } from "expo-av";
import { t } from "i18next";
import React, { memo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { MaterialContentType } from "types/TrainingTypes";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";
import { millisToTime } from "utils/Utils";

interface MateriProps {
  params: any;
  query: any;
  setQuery: any;
  sortList: { id: number; title: string }[];
  filterList: { id: number; title: string }[];
  typeList: { id: number; title: string }[];
  actionSheetRef: any;
  snapPoints: any;
  materiDetail: MaterialContentType[];
  isOpen: boolean;
  setIsOpen: any;
}

const Materi = ({
  params,
  query,
  setQuery,
  sortList,
  filterList,
  typeList,
  actionSheetRef,
  snapPoints,
  materiDetail,
  isOpen,
  setIsOpen,
}: MateriProps) => {
  const Content = memo(
    ({ item, index }: { item: MaterialContentType; index: number }) => {
      const [durationMillis, setDurationMillis] = useState(0);
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            NavigationService.navigate("ContentDetailScreen", {
              ...params,
              data: item,
            });
          }}
        >
          <Card style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", gap: 15 }}>
              <Image
                source={
                  item?.cover ? { uri: item?.cover.url } : images.placeholder
                }
                style={{
                  height: 100,
                  width: 100,
                  resizeMode: "cover",
                  borderRadius: 8,
                }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    backgroundColor: colors.stone100,
                    borderRadius: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    size={10}
                    color={colors.red}
                    type="bold"
                    variant="CenturyGothicBold"
                  >
                    {item?.body_type === 1 && t("video").toUpperCase()}
                    {item?.body_type === 2 && t("dokumen").toUpperCase()}
                    {item?.body_type === 3 && t("materi").toUpperCase()}
                  </Text>
                </View>
                <Space height={3} />
                <Text type="bold" variant="CenturyGothicBold" numberOfLines={3}>
                  {item?.title}
                </Text>
                {item?.body_type === 1 && (
                  <Video
                    source={{
                      uri: item.file?.url,
                    }}
                    onLoad={(status: any) => {
                      setDurationMillis(status?.durationMillis);
                    }}
                    style={{ height: 0, width: 0 }}
                    useNativeControls
                    shouldPlay={false}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                  />
                )}
              </View>
            </View>
            <Space height={10} />
            <Text size={12} numberOfLines={3} style={{ flex: 1 }}>
              {item?.description}
            </Text>
            <Space height={10} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {item?.progress?.status !== 1 && item?.body_type === 1 ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text size={12}>
                    {durationMillis !== 0 &&
                      item?.progress?.duration &&
                      `${t("sisa")} ${millisToTime(
                        durationMillis - Number(item?.progress?.duration),
                      )}`}
                    {durationMillis !== 0 && !item?.progress && `sisa 00:00`}
                  </Text>
                  <View>
                    <View
                      style={{
                        height: 8,
                        width: 120,
                        backgroundColor: colors.stone200,
                        borderRadius: 8,
                      }}
                    />

                    {durationMillis !== 0 && (
                      <View
                        style={{
                          height: 8,
                          width:
                            ((Number(item?.progress?.duration || 0) /
                              durationMillis) *
                              100 *
                              120) /
                            100,
                          backgroundColor: colors.red,
                          borderRadius: 8,
                          position: "absolute",
                        }}
                      />
                    )}
                  </View>
                </View>
              ) : (
                !item?.progress && <View></View>
              )}

              {item?.progress && item?.progress?.status === 1 && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    color={colors.accent}
                    size={16}
                    type="bold"
                    variant="CenturyGothicBold"
                  >
                    {t("selesai")}
                  </Text>
                  <Image
                    source={icons.materiSuccess}
                    style={{ height: 28, width: 28, resizeMode: "contain" }}
                  />
                </View>
              )}

              {item?.progress?.status !== 1 && (
                <Image
                  source={
                    item?.body_type === 2
                      ? icons.materiDokumen
                      : item?.body_type === 3
                      ? icons.materi
                      : icons.materiVideo
                  }
                  style={{
                    height: 48,
                    width: 48,
                    resizeMode: "contain",
                  }}
                />
              )}
              {item?.progress?.status === 1 && (
                <Image
                  source={
                    item.body_type === 2
                      ? icons.materiDokumenOutline
                      : icons.materiRepeat
                  }
                  style={{
                    height: 48,
                    width: 48,
                    resizeMode: "contain",
                  }}
                />
              )}
            </View>
          </Card>
        </TouchableOpacity>
      );
    },
  );

  // const Content = ({
  //   item,
  //   index,
  // }: {
  //   item: MaterialContentType;
  //   index: number;
  // }) => {

  // };
  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <SearchAndSort
        search={query?.search}
        setSearch={val => {
          setQuery({ ...query, search: val });
          //filterModule(selectedSort, val);
        }}
        actionSheetRef={actionSheetRef}
        btnText={t("filter")}
        placeholder={t("cari")}
        marginHorizontal={scaledHorizontal(0)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Space height={10} />

      {materiDetail
        ?.filter(item => {
          if (query?.search && query.search !== "") {
            const searchRegex = new RegExp(query.search, "i");

            return searchRegex.test(item?.title);
          } else {
            return true;
          }
        })
        ?.filter(item => {
          return query?.type.some(
            (itm: { id: number }) => itm.id === item.body_type,
          );
        })
        ?.filter(item => {
          if (query?.filter?.length === 2) {
            return item;
          } else {
            if (query?.filter[0]?.id === 2) {
              return item?.progress === null;
            } else {
              return item?.progress;
            }
          }
        })
        .sort((a, b) => {
          const highValue = 999999;
          const aValue =
            a?.progress === null || a?.progress?.status === 2
              ? highValue
              : a?.progress?.status;
          const bValue =
            b?.progress === null || b?.progress?.status === 2
              ? highValue
              : b?.progress?.status;

          if (query?.sort?.id === 2) {
            return bValue - aValue;
          } else {
            const normalAValue =
              a?.progress?.status === null ? -Infinity : a?.progress?.status;
            const normalBValue =
              b?.progress?.status === null ? -Infinity : b?.progress?.status;
            return normalAValue - normalBValue;
          }
        })
        .map((item, index) => {
          return <Content item={item} index={index} key={index} />;
        })}

      <MateriActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        filterList={filterList}
        sortList={sortList}
        typeList={typeList}
        query={query}
        setQuery={setQuery}
      />
    </View>
  );
};

export default Materi;
