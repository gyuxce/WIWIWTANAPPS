import { ScrollView, View, ActivityIndicator, Platform } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import globalStyles from "utils/GlobalStyles";
import Header from "components/Header";
import Avatar from "components/Avatar";
import images from "configs/images";
import Text from "components/Text";
import colors from "configs/colors";
import Space from "components/Space";
import { useForum } from "hooks/useForum";
import type { ForumPostType } from "types/ForumTypes";
import type { QueryType } from "types/QueryTypes";
import ForumComment from "components/ForumComment";
import SearchAndSort from "components/SearchAndSort";
import SortActionSheet from "components/SortActionSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { MetaTypes } from "types/MetaTypes";

import styles from "./styles";
import { t } from "i18next";

const UserForumDetailScreen = ({ route }: any) => {
  const timeout: any = useRef(null);
  const actionSheetRef = useRef<BottomSheetModal>(null);
  const [selectedSort, setSelectedSort] = useState({
    id: "desc",
    title: "Postingan Terbaru",
  });
  const dataSort = [
    { id: "desc", title: "Postingan Terbaru" },
    { id: "asc", title: "Postingan Terlama" },
  ];
  const [queryParams, setQueryParams] = useState({
    type: "pagination",
    relations: ["user", "topic"],
    page: 1,
    limit: 5,
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [
      ["filter,is_publish,equal,1"],
      [`filter,user.uuid,equal,${route?.params?.user?.id}`],
    ],
  } as QueryType);
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [search, setSearch] = useState("");
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const snapPoints = useMemo(() => [240], []);
  const [forumUser, setForumUser] = useState([] as ForumPostType[]);
  const [metaForum, setMetaForum] = useState({} as MetaTypes);

  const { getPostForumSearch } = useForum();

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const onSearch = (text: string) => {
    setIsLoadingSearch(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setQueryParams({
        ...queryParams,
        q: text,
      });
      getPostForumSearch([] as ForumPostType[], {
        ...queryParams,
        q: text,
        page: 1,
        limit: 5,
      }).then(({ data, meta }) => {
        setMetaForum(meta as MetaTypes);
        setForumUser(data as ForumPostType[]);
        setIsLoadingSearch(false);
      });
    }, 1000);
    setSearch(text);
  };

  const loadMoreSearch = () => {
    if (metaForum?.current_page < metaForum?.last_page) {
      setLoadingIndicators(true);
      getPostForumSearch([], {
        ...queryParams,
        page: metaForum?.current_page + 1,
        limit: 5,
      }).then(({ data, meta }) => {
        setMetaForum(meta as MetaTypes);
        const joinData = [...forumUser, ...(data as ForumPostType[])];
        setForumUser(joinData);
        setLoadingIndicators(false);
      });
    }
  };

  useEffect(() => {
    getPostForumSearch([] as ForumPostType[], queryParams).then(
      ({ data, meta }) => {
        setMetaForum(meta as MetaTypes);
        if (data) {
          setForumUser(data);
        }
        setIsLoadingSearch(false);
      },
    );
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withTextTitle
        withBackButton
        totalNotification={4}
        textJapan="アカウント"
        textTitle="Akun"
        withBell
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={event => {
          if (isCloseToBottom(event.nativeEvent)) {
            if (!loadingIndicators) {
              loadMoreSearch();
            }
          }
        }}
      >
        <View style={styles.content}>
          <View style={styles.wrapperImg}>
            <Avatar
              image={
                route?.params?.user?.profilePicture
                  ? { uri: route?.params?.user?.profilePicture?.url }
                  : images.userDefault
              }
              style={{ padding: 0, borderWidth: 1 }}
            />
          </View>
          <Space height={12} />
          <Text color={colors.red} type="bold" variant="CenturyGothicBold">
            {route?.params?.user?.name}
          </Text>
          <Space height={4} />

          <Text size={12}>{"-"}</Text>
          <View style={styles.post}>
            <Text size={10} variant="CenturyGothicBold" type="bold">
              {metaForum?.total || 0} {t("postingan_forum")}
            </Text>
          </View>
        </View>
        <Space height={40} />
        <View>
          <SearchAndSort
            placeholder={`${t("cari_postingan")} ${route?.params?.user?.name}`}
            search={search}
            setSearch={onSearch}
            actionSheetRef={actionSheetRef}
          />
          {isLoadingSearch ? (
            <View>
              <Space height={100} />
              <ActivityIndicator size={"large"} color={colors.black} />
            </View>
          ) : (
            <View>
              {forumUser?.length > 0 ? (
                <View>
                  {forumUser.map(
                    (
                      item: ForumPostType,
                      index: React.Key | null | undefined,
                    ) => {
                      return <ForumComment key={index} post={item} />;
                    },
                  )}
                  {loadingIndicators && (
                    <View>
                      <Space height={15} />
                      <ActivityIndicator size={"large"} color={colors.black} />
                    </View>
                  )}
                </View>
              ) : !search && forumUser?.length === 0 ? (
                <View>
                  <Space height={100} />
                  <Text textAlign="center">Tidak ada postingan</Text>
                </View>
              ) : (
                <View>
                  <Space height={100} />
                  <Text textAlign="center">Pencarian tidak ditemukan</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <Space height={110} />
      </ScrollView>
      <SortActionSheet
        actionSheetRef={actionSheetRef}
        snapPoints={snapPoints}
        dataSort={dataSort}
        setSelectedSort={sort => {
          setSelectedSort(sort);
          setIsLoadingSearch(true);
          getPostForumSearch([] as ForumPostType[], {
            ...queryParams,
            q: search,
            order_by: "created_at",
            sort_by: sort.id,
            page: 1,
            limit: 5,
          }).then(({ data, meta }) => {
            setMetaForum(meta as MetaTypes);
            setForumUser(data as ForumPostType[]);
            setIsLoadingSearch(false);
          });
        }}
        selectedSort={selectedSort}
      />
    </View>
  );
};

export default UserForumDetailScreen;
