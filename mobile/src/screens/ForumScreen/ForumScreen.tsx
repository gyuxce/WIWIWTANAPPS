import Button from "components/Button";
import Header from "components/Header";
import Space from "components/Space";
import colors from "configs/colors";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import Card from "components/Card";
import Section from "components/Section";
import ForumTopic from "components/ForumTopic/ForumTopic";
import Text from "components/Text";
import TextInput from "components/TextInput";
import fonts from "configs/fonts";
import ForumComment from "components/ForumComment";
import { useForum } from "hooks/useForum";
import { useConstant } from "hooks/useConstant";
import type { QueryType } from "types/QueryTypes";
import type { ForumPostType, ForumTopicType } from "types/ForumTypes";
import { useIsFocused } from "@react-navigation/core";
import { useDispatch } from "react-redux";
import { onGetForumPost } from "stores/forum/forumSlice";
import type { MetaTypes } from "types/MetaTypes";
import NavigationService from "utils/NavigationService";
import { useTranslation } from "react-i18next";

import {
  belajarDanPeluangDiLuarNegeri,
  hidupDanKerjaDiJepang,
  karirDiJepang,
  praktikalJepang,
  softSkill,
  teoriJepang,
} from "./ConfigTypes";
import Popular from "./Popular/Popular";
import Trending from "./Trending/Trending";
import MyPost from "./MyPost/MyPost";

const ForumScreen = () => {
  const { t } = useTranslation();
  const timeout: any = useRef(null);
  const isFocused = useIsFocused();
  const [selectedPost, setSelectedPost] = useState(1);
  const [isTopicCollapsed, setIsTopicCollapsed] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState({
    type: "pagination",
    relations: ["user.profilePicture", "topic"],
    page: 1,
    limit: 5,
    q: "",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);
  const [myForumQuery, setMyForumQuery] = useState({
    type: "pagination",
    relations: ["user", "user.profilePicture", "topic"],
    page: 1,
    limit: 5,
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);
  const [trendingQuery, setTrendingQuery] = useState({
    type: "pagination",
    relations: ["user.profilePicture", "topic"],
    page: 1,
    limit: 5,
    type_post: "trending",
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);
  const [populerQuery, setPopulerQuery] = useState({
    type: "pagination",
    relations: ["user.profilePicture", "topic"],
    page: 1,
    limit: 5,
    type_post: "populer",
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);

  const {
    getTopicType,
    forumSearch,
    getPostForumSearch,
    metaSearch,
    metaMyForumPost,
    getMyForumPost,
    myForumPost,
    getPopulerPost,
    getTrendingPost,
    metaPopulerPost,
    metaTrendingPost,
    trendingPost,
    populerPost,
  } = useForum();
  const dispatch = useDispatch();
  const { getForumTopicType, forumTopicType } = useConstant();
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [isLoadingMyPost, setIsLoadingMyPost] = useState(false);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [loadingIndicatorMyPost, setLoadingIndicatorMyPost] = useState(false);
  const [topicPopuler, setTopicPopuler] = useState(
    [] as {
      id: string;
      title: string;
      subtitle: string;
      totalDiscussion: number;
      image: any;
    }[],
  );
  const [topic, setTopic] = useState(
    [] as {
      id: string;
      title: string;
      subtitle: string;
      totalDiscussion: number;
      image: any;
      type: number;
    }[],
  );

  const dataTrend = [
    { id: 1, title: t("trending") },
    { id: 2, title: t("populer") },
    { id: 3, title: t("postinganku") },
  ];

  const populateData = (item: ForumTopicType) => {
    switch (item?.name) {
      case "Teori Bahasa Jepang":
        return {
          ...teoriJepang,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      case "Praktikal Bahasa Jepang":
        return {
          ...praktikalJepang,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      case "Soft Skill":
        return {
          ...softSkill,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      case "Karir di Jepang":
        return {
          ...karirDiJepang,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      case "Hidup & Kerja di Jepang":
        return {
          ...hidupDanKerjaDiJepang,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      case "Belajar & Peluang lain di luar negeri":
        return {
          ...belajarDanPeluangDiLuarNegeri,
          id: item?.id,
          type: item?.type,
          totalDiscussion: item?.count_post || 0,
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    setIsSearch(false);
    setIsLoadingTopic(true);
    getForumTopicType().then(val => {
      if (val.status === "success") {
        getTopicType({
          type: "collection",
          order_by: "count_post",
          sort_by: "desc",
        }).then(({ status, data }) => {
          if (status === "success" && data) {
            if (data?.length > 0) {
              const updatedTopic = data?.map(item => populateData(item));
              const updatedTopicPopuler = [...data]
                .sort((a, b) => b.count_post - a.count_post)
                .splice(0, 3)
                .map(item => populateData(item));

              const filteredUpdatedTopicPopuler: any =
                updatedTopicPopuler.filter(item => item !== null);

              const filteredUpdatedTopic: any = updatedTopic.filter(
                item => item !== null,
              );

              setTopic(filteredUpdatedTopic);
              setTopicPopuler(filteredUpdatedTopicPopuler);
              setIsLoadingTopic(false);
            }
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    getPostForumSearch([] as ForumPostType[], searchQuery).then(() => {
      setIsLoadingSearch(false);
    });
    setIsLoadingMyPost(true);
    getMyForumPost([] as ForumPostType[], myForumQuery).then(() => {
      setIsLoadingMyPost(false);
    });
    getTrendingPost([] as ForumPostType[], trendingQuery).then(() => {
      setIsLoadingMyPost(false);
    });
    getPopulerPost([] as ForumPostType[], populerQuery).then(() => {
      setIsLoadingMyPost(false);
    });
  }, [isFocused]);

  const onSearch = (text: string) => {
    setIsLoadingSearch(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setSearchQuery({
        ...searchQuery,
        q: text,
      });
      getPostForumSearch([] as ForumPostType[], {
        ...searchQuery,
        q: text,
        page: 1,
        limit: 5,
      }).then(() => {
        setIsLoadingSearch(false);
      });
    }, 1000);
    setSearch(text);
  };

  const resetSearch = () => {
    setSearch("");
    setSearchQuery({
      ...searchQuery,
      q: "blablabla",
    });
    dispatch(onGetForumPost({ data: [], meta: {} as MetaTypes }));
  };

  const loadMoreSearch = () => {
    if (isSearch) {
      if (metaSearch.current_page < metaSearch.last_page) {
        setLoadingIndicators(true);
        getPostForumSearch(forumSearch, {
          ...searchQuery,
          page: metaSearch?.current_page + 1,
          limit: 5,
        }).then(() => {
          setLoadingIndicators(false);
        });
      }
    }
  };

  const loadMoreMyForum = () => {
    if (metaMyForumPost.current_page < metaMyForumPost.last_page) {
      setLoadingIndicatorMyPost(true);
      getMyForumPost(myForumPost, {
        ...myForumQuery,
        page: metaMyForumPost?.current_page + 1,
        limit: 5,
      }).then(() => {
        setLoadingIndicatorMyPost(false);
      });
    }
  };

  const loadMorePopuler = () => {
    if (metaPopulerPost.current_page < metaPopulerPost.last_page) {
      setLoadingIndicatorMyPost(true);
      getPopulerPost(populerPost, {
        ...populerQuery,
        page: metaPopulerPost?.current_page + 1,
        limit: 5,
      }).then(() => {
        setLoadingIndicatorMyPost(false);
      });
    }
  };

  const loadMoreTrending = () => {
    if (metaTrendingPost.current_page < metaTrendingPost.last_page) {
      setLoadingIndicatorMyPost(true);
      getTrendingPost(trendingPost, {
        ...trendingQuery,
        page: metaTrendingPost?.current_page + 1,
        limit: 5,
      }).then(() => {
        setLoadingIndicatorMyPost(false);
      });
    }
  };

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

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        withBell
        totalNotification={4}
        withBurger={isSearch ? false : true}
        textTitleJapanLeft={isSearch ? "" : "フォーラム"}
        textTitleLeft={isSearch ? "" : "Forum"}
        textTitle={isSearch ? "Forum" : ""}
        textJapan={isSearch ? "フォーラム" : ""}
        withTextTitle={isSearch ? true : false}
        withSearch
        onSearch={() => {
          setIsSearch(!isSearch);
          resetSearch();
        }}
        withBackLeft={isSearch}
        onBackLeft={() => {
          setIsSearch(false);
          resetSearch();
        }}
        withAddForum
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={event => {
          if (isCloseToBottom(event.nativeEvent)) {
            if (!loadingIndicators) {
              if (!isSearch && selectedPost === 3) {
                loadMoreMyForum();
              } else if (!isSearch && selectedPost === 1) {
                loadMoreTrending();
              } else if (!isSearch && selectedPost === 2) {
                loadMorePopuler();
              } else if (isSearch) {
                loadMoreSearch();
              }
            }
          }
        }}
      >
        {isSearch ? (
          <View>
            <Space height={20} />
            <TextInput
              value={search}
              onChange={(text: string) => {
                onSearch(text);
              }}
              borderLess={false}
              placeholder={t("cari")}
              placeholderColor={colors.black}
              stylesBox={{
                backgroundColor: colors.white,
                flex: 1,
                marginHorizontal: scaledHorizontal(25),
              }}
              textStyle={{
                fontFamily:
                  search?.length > 0
                    ? fonts.CenturyGothicBold
                    : fonts.CenturyGothicRegular,
                textAlign: "left",
                //paddingLeft: scaledHorizontal(30),
                textAlignVertical: "center",
                marginTop: -5,
              }}
              onClearButton={search?.length > 0}
              onClear={resetSearch}
              wrapStyle={{ height: 30 }}
              withError={false}
            />

            {isLoadingSearch ? (
              <View>
                <Space height={100} />
                <ActivityIndicator size={"large"} color={colors.black} />
              </View>
            ) : (
              <View>
                {forumSearch && forumSearch?.length > 0 ? (
                  <View>
                    {forumSearch.map(
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
                        <ActivityIndicator
                          size={"large"}
                          color={colors.black}
                        />
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <Space height={100} />
                    <Text textAlign="center">
                      {t("pencarian_tidak_ditemukan")}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            <Space height={20} />
            <Card style={{ marginHorizontal: scaledHorizontal(25) }}>
              <Section
                textTitle={isTopicCollapsed ? "Topik" : "Topik Populer"}
                textJapan={isTopicCollapsed ? "話題" : "人気の話題"}
                size={20}
              />
              {isTopicCollapsed ? (
                <View>
                  <Space height={20} />
                  {forumTopicType.map((item, index) => {
                    return (
                      <View key={index}>
                        <Text textAlign={"center"}>{item?.name}</Text>
                        <Space height={20} />
                        {topic
                          .filter(filter => filter.type === item?.value)
                          ?.map((itemTopic, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  NavigationService.navigate(
                                    "ForumCategoryScreen",
                                    {
                                      id: itemTopic?.id,
                                      name: itemTopic?.title,
                                    },
                                  );
                                }}
                              >
                                <ForumTopic
                                  title={itemTopic?.title}
                                  subtitle={itemTopic?.subtitle}
                                  totalDiscussion={itemTopic?.totalDiscussion}
                                  image={itemTopic?.image}
                                />
                                <Space height={20} />
                              </TouchableOpacity>
                            );
                          })}
                        <Space height={20} />
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View>
                  <Space height={20} />
                  {isLoadingTopic ? (
                    <ActivityIndicator size={"large"} color={colors.black} />
                  ) : (
                    <View style={{ flex: 1 }}>
                      {topicPopuler?.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              NavigationService.navigate(
                                "ForumCategoryScreen",
                                {
                                  id: item?.id,
                                  name: item?.title,
                                },
                              );
                            }}
                          >
                            <ForumTopic
                              title={item?.title}
                              subtitle={item?.subtitle}
                              totalDiscussion={item?.totalDiscussion}
                              image={item?.image}
                            />
                            <Space height={20} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              <View
                style={{
                  marginHorizontal: scaledHorizontal(50),
                  marginTop: scaledVertical(20),
                }}
              >
                <Button
                  onPress={() => setIsTopicCollapsed(!isTopicCollapsed)}
                  title={
                    isTopicCollapsed ? t("kecilkan") : t("lihat_semua_topik")
                  }
                  style={{ paddingVertical: scaledVertical(20) }}
                  textType="bold"
                  variant="CenturyGothicBold"
                  textStyle={{ fontSize: 10 }}
                />
              </View>
            </Card>
            <Space height={30} />
            <View
              style={{
                flexDirection: "row",
                gap: 3,
                marginTop: 10,
                marginHorizontal: scaledHorizontal(25),
                justifyContent: "center",
              }}
            >
              {dataTrend.map((item, index) => {
                return (
                  <Button
                    key={index}
                    onPress={() => {
                      setSelectedPost(index + 1);
                    }}
                    title={item.title}
                    style={{
                      borderWidth: item.id === selectedPost ? 1 : 0,
                      paddingHorizontal: 5,
                      borderRadius: 6,
                      paddingVertical: 6,
                      backgroundColor:
                        item.id === selectedPost
                          ? colors.white
                          : colors.stone100,
                    }}
                    textType="bold"
                    variant="CenturyGothicBold"
                    textStyle={{
                      fontWeight: "600",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                    withBorder={false}
                  />
                );
              })}
            </View>

            {selectedPost === 1 && (
              <Trending
                isLoading={isLoadingMyPost}
                post={trendingPost}
                loadingIndicator={loadingIndicatorMyPost}
                setTrendingQuery={setTrendingQuery}
                trendingQuery={trendingQuery}
                setIsLoading={setIsLoadingMyPost}
              />
            )}
            {selectedPost === 2 && (
              <Popular
                isLoading={isLoadingMyPost}
                post={populerPost}
                loadingIndicator={loadingIndicatorMyPost}
                setPopulerQuery={setPopulerQuery}
                populerQuery={populerQuery}
                setIsLoading={setIsLoadingMyPost}
              />
            )}
            {selectedPost === 3 && (
              <MyPost
                isLoading={isLoadingMyPost}
                post={myForumPost}
                loadingIndicator={loadingIndicatorMyPost}
                setMyForumQuery={setMyForumQuery}
                myForumQuery={myForumQuery}
                setIsLoading={setIsLoadingMyPost}
              />
            )}
          </View>
        )}

        <Space height={110} />
      </ScrollView>
    </View>
  );
};

export default ForumScreen;
