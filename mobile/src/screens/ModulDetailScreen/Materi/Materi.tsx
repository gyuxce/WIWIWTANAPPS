import Card from "components/Card";
import MateriActionSheet from "components/MateriActionSheet";
import SearchAndSort from "components/SearchAndSort";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import { t } from "i18next";
import React, { memo, useMemo } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import type { MaterialContentType } from "types/TrainingTypes";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal } from "utils/ScaledService";

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

/**
 * One material card.
 *
 * This lives at module scope on purpose. It used to be declared inside
 * Materi's body, which made it a *different component type* on every render of
 * the list. React cannot match a new type against an existing element, so it
 * tore down all twenty-odd cards and rebuilt them from scratch every time --
 * on each keystroke in the search box, each filter change, each refetch. The
 * memo() wrapper could never help, because memo compares props on a type that
 * no longer exists. Hoisting it is what gives that memo something to do, and
 * it is the bulk of why opening and leaving this screen felt like it stalled.
 */
const Content = memo(
  ({ item, params }: { item: MaterialContentType; params: any }) => {
    // Each video row used to mount a hidden zero-sized <Video> purely to
    // read durationMillis for a "sisa 01:35" label. In a module like Guntai
    // 1 that is nine simultaneous native decoders -- device logs showed nine
    // live AudioTrack sessions and ~150MB of video buffer pools -- and they
    // stayed alive even after navigating away, because the list screen stays
    // mounted underneath. That starved the PDF reader of memory and network
    // and made documents fail to download.
    //
    // Staggering their start (the previous attempt) only delayed the pile-up
    // rather than bounding it. The label was never worth that cost: it also
    // required item.progress.duration to be set, so most rows showed nothing
    // anyway. The real fix is to store each video's duration on upload so
    // this can be read from the API instead of decoded on the device.

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
        {/*
         * Compact single-row layout. The card used to be a 100px block on
         * the left with badge+title beside it, then description, then a
         * status row spanning the full width -- which left an obvious dead
         * zone on the right once descriptions turned out to be mostly empty.
         * Folding everything into the right-hand column removes that gap and
         * fits noticeably more materials on screen.
         */}
        <Card style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            {/*
             * Covers are never going to be uploaded -- there is no designer
             * on the team -- so a 72px box for them was a container
             * pretending to hold an image. Worse, its fixed height forced a
             * visible gap whenever the description was empty. The type icon
             * now sits inline with the badge at 20px (see below), so the
             * card's height follows its actual content. A cover is still
             * honoured if one ever exists.
             */}
            {item?.cover && (
              <Image
                source={{ uri: item?.cover.url }}
                style={{
                  height: 72,
                  width: 72,
                  resizeMode: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <View style={{ flex: 1 }}>
              {/*
               * Type icon inline with its label: enough of a shape to scan
               * a long list by, without a container that has to be filled.
               */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: colors.stone100,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
              >
                <Image
                  source={typeIcon}
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                />
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
              {/* Empty descriptions used to render as a stray "-" line. */}
              {hasDescription && (
                <>
                  <Space height={4} />
                  <Text size={12} numberOfLines={2}>
                    {description}
                  </Text>
                </>
              )}
              <Space height={6} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/*
                 * "Sisa xx:xx" and its progress bar both needed the video's
                 * total length, which was only obtainable by decoding the
                 * file on the device -- see the note at the top of this
                 * component for why that had to go. A started-but-unfinished
                 * video now simply says so.
                 */}
                {item?.progress?.status !== 1 &&
                item?.body_type === 1 &&
                item?.progress?.duration ? (
                  <Text size={12} color={colors.stone500}>
                    {t("sedang_berjalan")}
                  </Text>
                ) : (
                  <View />
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
                 * card leads with a type block on the left now, so repeating
                 * it here was redundant -- and because it looked like a
                 * button (download arrow) next to no other controls,
                 * students read it as an action that doesn't exist.
                 */}
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  },
);

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
  // Filtering and sorting ran on every render, and .sort() mutates: the same
  // array coming back from the hook was reordered in place each pass, so the
  // list could settle differently from one render to the next for no reason a
  // reader could see. Copying before sorting fixes that, and memoising means
  // the work happens when the data or the filters change rather than whenever
  // anything at all on the screen does.
  const visibleMateri = useMemo(() => {
    return (materiDetail || [])
      .filter(item => {
        if (query?.search && query.search !== "") {
          const searchRegex = new RegExp(query.search, "i");

          return searchRegex.test(item?.title);
        } else {
          return true;
        }
      })
      .filter(item => {
        return query?.type.some(
          (itm: { id: number }) => itm.id === item.body_type,
        );
      })
      .filter(item => {
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
      .slice()
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
      });
  }, [materiDetail, query]);

  return (
    <View style={{ marginHorizontal: scaledHorizontal(25) }}>
      <SearchAndSort
        search={query?.search}
        setSearch={val => {
          setQuery({ ...query, search: val });
        }}
        actionSheetRef={actionSheetRef}
        btnText={t("filter")}
        placeholder={t("cari")}
        marginHorizontal={scaledHorizontal(0)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Space height={10} />

      {visibleMateri.map((item, index) => (
        // Keyed by the material's own id rather than its list position, so
        // reordering by filter or sort moves the existing cards instead of
        // rewriting the contents of cards that stayed put.
        <Content key={item?.id ?? index} item={item} params={params} />
      ))}

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
