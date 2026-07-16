import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import ForumComment from "components/ForumComment";
import SearchAndSort from "components/SearchAndSort";
import SortActionSheet from "components/SortActionSheet";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { useForum } from "hooks/useForum";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import type { ForumPostType } from "types/ForumTypes";
import type { QueryType } from "types/QueryTypes";

interface TrendingProps {
  isLoading: boolean;
  post: ForumPostType[];
  loadingIndicator: boolean;
  setTrendingQuery: any;
  trendingQuery: QueryType;
  setIsLoading: (args: boolean) => void;
}

const Trending = ({
  isLoading,
  post,
  loadingIndicator,
  setTrendingQuery,
  trendingQuery,
  setIsLoading,
}: TrendingProps) => {
  const { t } = useTranslation();
  const { getTrendingPost } = useForum();
  const [search, setSearch] = useState("");
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const [selectedSort, setSelectedSort] = useState({
    id: "desc",
    title: t("postingan_terbaru"),
  });
  const dataSort = [
    { id: "desc", title: t("postingan_terbaru") },
    { id: "asc", title: t("postingan_terlama") },
  ];
  const snapPoints = useMemo(() => [240], []);
  const timeout: any = useRef(null);

  const onSearch = (text: string) => {
    setIsLoading(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setTrendingQuery({
        ...trendingQuery,
        q: text,
        page: 1,
        limit: 5,
      });
      getTrendingPost([] as ForumPostType[], {
        ...trendingQuery,
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
    <View style={styles.container}>
      <Space height={20} />
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
          {post && post?.length > 0 ? (
            <>
              {post.map((item: ForumPostType, index: number) => {
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
                <View>
                  <Space height={50} />
                  <Text textAlign="center">
                    {t("tidak_ada_trending_post_saat_ini")}
                  </Text>
                </View>
              )}
            </View>
          )}
          {loadingIndicator && (
            <View>
              <Space height={50} />
              <ActivityIndicator size={"large"} color={colors.black} />
            </View>
          )}
        </View>
      )}

      <SortActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
          setIsLoading(true);
          getTrendingPost([] as ForumPostType[], {
            ...trendingQuery,
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
      <Space height={70} />
    </View>
  );
};

export default Trending;

const styles = StyleSheet.create({
  container: {},
});
