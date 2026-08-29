import Card from "components/Card";
import MateriActionSheet from "components/MateriActionSheet";
import SearchAndSort from "components/SearchAndSort";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { ResizeMode, Video } from "expo-av";
import { t } from "i18next";
import React, { memo, useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { MaterialContentType } from "types/TrainingTypes";
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
      const [shouldProbeDuration, setShouldProbeDuration] = useState(false);

      // Every video row used to mount an invisible <Video> the instant this
      // list rendered, just to read its duration for the "sisa xx:xx"
      // progress text/bar. With many videos in one module, that meant
      // spinning up that many native video decoders all at once, which is
      // what made opening this list feel heavy/laggy. Staggering the probes
      // instead (capped so later rows don't wait too long) spreads that load
      // out over a couple of seconds instead of all at once.
      useEffect(() => {
        if (item?.body_type !== 1) {
          return;
        }
        const delay = Math.min(index, 20) * 150;
        const timer = setTimeout(() => setShouldProbeDuration(true), delay);
        return () => clearTimeout(timer);
      }, [item?.body_type, index]);

      // A PDF document has nothing useful on the intermediate detail screen
      // (title + filename only, descriptions are rarely filled in), so send
      // the student straight to the reader. Everything else still goes
      // through ContentDetailScreen, which is where video playback and
      // rich-text material actually live.
      const documentUrl = item?.file?.url || "";
      const [documentName] = String(item?.file?.filename || documentUrl)
        .toLowerCase()
        .split("?");
      const isPdfDocument =
        item?.body_type === 2 &&
        !!documentUrl &&
        (documentName || "").endsWith(".pdf");

      const typeIcon =
        item?.body_type === 1
          ? icons.materiVideo
          : item?.body_type === 2
          ? icons.document
          : icons.materi;

      const description = String(item?.description || "").trim();
      const hasDescription = description !== "" && description !== "-";

      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (isPdfDocument) {
              NavigationService.navigate("PdfViewerScreen", {
                title: item?.title || item?.file?.filename || "Dokumen",
                url: documentUrl,
                materialContentId: item?.id,
              });
              return;
            }
            NavigationService.navigate("ContentDetailScreen", {
              ...params,
              data: item,
            });
          }}
        >
          <Card style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", gap: 15 }}>
              {/*
               * Covers are optional content that in practice is almost never
               * uploaded, so this used to be a meaningless grey placeholder
               * occupying the most prominent spot on the card. Falling back to
               * the material's type icon fills that space with something the
               * student can actually read at a glance, and makes uploading a
               * cover an enhancement rather than a requirement.
               */}
              {item?.cover ? (
                <Image
                  source={{ uri: item?.cover.url }}
                  style={{
                    height: 100,
                    width: 100,
                    resizeMode: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 8,
                    backgroundColor: colors.stone100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={typeIcon}
                    style={{ height: 44, width: 44, resizeMode: "contain" }}
                  />
                </View>
              )}
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
                {item?.body_type === 1 && shouldProbeDuration && (
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
            {/* Empty descriptions used to render as a stray "-" line. */}
            {hasDescription && (
              <>
                <Space height={10} />
                <Text size={12} numberOfLines={3} style={{ flex: 1 }}>
                  {description}
                </Text>
              </>
            )}
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
                    {durationMillis !== 0 && !item?.progress && "sisa 00:00"}
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
                !item?.progress && <View />
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

              {/*
               * The trailing type icon that used to sit here is gone: the
               * card now leads with a type block on the left, so repeating it
               * at bottom-right was redundant -- and because it looked like a
               * button (download arrow) next to no other controls, students
               * read it as an action that doesn't exist.
               */}
              {/*
               * A trailing icon used to render here for completed items (a
               * download-arrow, later a reload-arrow). Both read as an action
               * button that doesn't exist -- nothing downloads, and the whole
               * card is already tappable to reopen. Completed rows now just
               * say "Selesai ✓" on the left and nothing on the right.
               */}
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
