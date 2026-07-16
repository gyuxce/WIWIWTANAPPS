import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import ForumComment from "components/ForumComment";
import Header from "components/Header";
import SearchAndSort from "components/SearchAndSort";
import SortActionSheet from "components/SortActionSheet";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { useForum } from "hooks/useForum";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Platform, ActivityIndicator, ScrollView } from "react-native";
import { ForumPostType } from "types/ForumTypes";
import { RootStackParamList } from "types/NavigatorTypes";
import { QueryType } from "types/QueryTypes";
import globalStyles from "utils/GlobalStyles";
import { isCloseToBottom } from "utils/Utils";

type ForumCategoryRouteType = RouteProp<
  RootStackParamList,
  "ForumCategoryScreen"
>;

type ForumCategoryNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForumCategoryScreen"
>;

type Prop = {
  route: ForumCategoryRouteType;
  navigation: ForumCategoryNavigationProp;
};

const ForumCategoryScreen = ({ route }: Prop) => {
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingIndicator, setIsLoadingIndicator] = useState(false);
  const { getCategoryPostForum, categoryPostForum, metaCategoryPostForum } =
    useForum();
  const { t } = useTranslation();
  const snapPoints = useMemo(() => [240], []);
  const timeout: any = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState({
    id: "desc",
    title: t("postingan_terbaru"),
  });
  const dataSort = [
    { id: "desc", title: t("postingan_terbaru") },
    { id: "asc", title: t("postingan_terlama") },
  ];
  const [searchQuery, setSearchQuery] = useState({
    type: "pagination",
    relations: ["user", "topic"],
    page: 1,
    limit: 5,
    q: "",
    sort_by: selectedSort?.id,
    options: [
      ["filter,is_publish,equal,1"],
      [`filter,topic.uuid,equal,${route?.params?.id}`],
    ],
  } as QueryType);

  useEffect(() => {
    getCategoryPostForum([] as ForumPostType[], searchQuery).then(() => {
      setIsLoading(false);
    });
  }, [route?.params?.id]);

  const loadMoreSearch = () => {
    if (metaCategoryPostForum.current_page < metaCategoryPostForum.last_page) {
      setIsLoadingIndicator(true);
      getCategoryPostForum(categoryPostForum, {
        ...searchQuery,
        page: metaCategoryPostForum?.current_page + 1,
        limit: 5,
      }).then(() => {
        setIsLoadingIndicator(false);
      });
    }
  };

  const onSearch = (text: string) => {
    setIsLoading(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setSearchQuery({
        ...searchQuery,
        q: text,
        page: 1,
        limit: 5,
      });
      getCategoryPostForum([] as ForumPostType[], {
        ...searchQuery,
        q: text,
        page: 1,
        limit: 5,
      }).then(() => {
        setIsLoading(false);
      });
    }, 1000);
    setSearch(text);
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        textTitle={route?.params?.name}
        textJapan=""
        withTextTitle={true}
        withSearch
        withBackButton={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={event => {
          if (isCloseToBottom(event.nativeEvent)) {
            if (!isLoadingIndicator) {
              loadMoreSearch();
            }
          }
        }}
      >
        <Space height={10} />
        <SearchAndSort
          search={search}
          setSearch={onSearch}
          actionSheetRef={actionSheetRef}
          placeholder={t("cari")}
          btnText={t("urutkan")}
        />
        {isLoading ? (
          <View>
            <Space height={100} />
            <ActivityIndicator size={"large"} color={colors.black} />
          </View>
        ) : (
          <View>
            {categoryPostForum && categoryPostForum?.length > 0 ? (
              <>
                {categoryPostForum.map((item: ForumPostType, index: number) => {
                  return <ForumComment key={index} post={item} />;
                })}
              </>
            ) : (
              <View>
                {search.length > 0 ? (
                  <View>
                    <Space height={50} />
                    <Text textAlign="center">
                      {t("pencarian_tidak_ditemukan")}
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginHorizontal: 50 }}>
                    <Space height={50} />
                    <Text textAlign="center">
                      {t("tidak_ada_post_dengan_kategori")}{" "}
                      {route?.params?.name}.
                    </Text>
                  </View>
                )}
              </View>
            )}
            {isLoadingIndicator && (
              <View>
                <Space height={50} />
                <ActivityIndicator size={"large"} color={colors.black} />
              </View>
            )}
          </View>
        )}
        <Space height={70} />
      </ScrollView>
      <SortActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
          setIsLoading(true);
          getCategoryPostForum([] as ForumPostType[], {
            ...searchQuery,
            q: search,
            sort_by: sort.id,
            page: 1,
            limit: 5,
          }).then(() => {
            setIsLoading(false);
          });
        }}
        selectedSort={selectedSort}
      />
    </View>
  );
};

export default ForumCategoryScreen;
