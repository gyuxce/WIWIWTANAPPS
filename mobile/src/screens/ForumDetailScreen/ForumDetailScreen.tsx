import Button from "components/Button";
import Space from "components/Space";
import icons from "configs/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from "react-native";
import WebView from "react-native-webview";
import Clipboard from "@react-native-clipboard/clipboard";
import globalStyles from "utils/GlobalStyles";
import NavigationService from "utils/NavigationService";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import RenderHTML from "react-native-render-html";
import colors from "configs/colors";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import fonts from "configs/fonts";
import Card from "components/Card";
import Text from "components/Text";
import ForumHeader from "components/ForumHeader";
import ModalButtonList from "components/ModalButtonList";
import ModalAlert from "components/ModalAlert";
import type { ModalAlertProps } from "types/AppTypes";
import CommentForum from "components/CommentForumSection";
import BottomModal from "components/BottomModal";
import TextInput from "components/TextInput";
import { formatTimestamp, wait } from "utils/Utils";
import type { RouteProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/core";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "types/NavigatorTypes";
import { useForum } from "hooks/useForum";
import { ErrorStatus } from "utils/ErrorStatus";
import { useDispatch } from "react-redux";
import { useAuth } from "hooks/useAuth";
import {
  apiDeleteForumDetail,
  apiForumDislike,
  apiForumLike,
  apiPostReportPost,
} from "services/ForumServices";
import { useConstant } from "hooks/useConstant";
import Share from "react-native-share";
import { URL_CMS } from '@env';
import type { CommentType } from "types/CommentTypes";
import {
  apiDeleteComment,
  apiGetCommentList,
  apiPostComment,
  apiPutComment,
} from "services/CommentServices";
import type { QueryType } from "types/QueryTypes";
import type { MetaTypes } from "types/MetaTypes";
import type { ForumPostType, LikeType } from "types/ForumTypes";
import { onGetDetailForumPost } from "stores/forum/forumSlice";
import ForumPost from "components/ForumPost";
import { useTranslation } from "react-i18next";

type ForumDetailRouteType = RouteProp<RootStackParamList, "ForumDetailScreen">;

type ForumDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForumDetailScreen"
>;

type Prop = {
  route: ForumDetailRouteType;
  navigation: ForumDetailNavigationProp;
};

const ForumDetailScreen = ({ route }: Prop) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [buttonModal, setButtonModal] = useState({
    show: false,
    id: "",
    listButton: [
      { id: "report", title: "Laporkan Komentar" },
      { id: "copy-komentar", title: "Salin Komentar" },
    ],
  });
  const [reportText, setReportText] = useState("");
  const [showModal, setShowModal] = useState({} as ModalAlertProps);
  const [showBottomModal, setShowBottomModal] = useState({
    isNew: true,
    isShow: false,
    isReply: false,
  });
  const commentRef: any = useRef(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    getForumDetail,
    forumDetail,
    harshWord,
    getHarsWord,
    trendingPost,
    getTrendingPost,
    getSimiliarPostUser,
    similiarPostUser,
  } = useForum();
  const { getForumReportStatus } = useConstant();
  const { auth, user } = useAuth();
  const navigation = useNavigation();
  const [commentList, setCommentList] = useState([] as CommentType[]);
  const [commentListMeta, setCommentListMeta] = useState({} as MetaTypes);
  const [commentParam] = useState({
    type: "pagination",
    sort_by: "desc",
    order_by: "created_at",
    relations: [
      "user",
      "user.profilePicture",
      "child",
      "child.user",
      "child.user.profilePicture",
    ],
    page: 1,
    limit: 3,
    post_id: route?.params?.id,
  } as QueryType);

  const [trendingQuery] = useState({
    type: "pagination",
    relations: ["user", "user.profilePicture", "topic"],
    page: 1,
    limit: 3,
    type_post: "trending",
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,is_publish,equal,1"]],
  } as QueryType);
  const [commentSelected, setCommentSelected] = useState({
    parent_id: "",
    comment: {},
  } as { parent_id: string; comment: CommentType });
  const [comment, setComment] = useState({
    text: "",
    parentId: "",
    commentId: "",
  } as {
    text: string;
    parentId?: string;
    commentId?: string;
  });

  useEffect(() => {
    getForumReportStatus();
    getHarsWord({ type: "collection" });

    getTrendingPost([] as ForumPostType[], trendingQuery);
  }, []);

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    apiGetCommentList(auth?.accessToken, commentParam).then(
      ({ data, meta }) => {
        const comments: any = [];
        data.map(item => {
          comments.push({
            ...item,
            //showAllReplies: false,
            page: 1,
          });
        });

        setCommentList(comments);
        setCommentListMeta(meta);
      },
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getDetail();
    });
    return unsubscribe;
  }, [navigation]);

  const getDetail = () => {
    getForumDetail(route?.params?.id).then(({ data }) => {
      if (data) {
        try {
          const text = JSON.parse(JSON.parse(data?.description));

          const converter = new QuillDeltaToHtmlConverter(text?.ops, {
            inlineStyles: true,
          });
          const convertedHtml = converter.convert();
          setContent(convertedHtml);
          setIsLoading(false);
          const query: QueryType = {
            type: "pagination",
            relations: ["user", "user.profilePicture", "topic"],
            page: 1,
            limit: 3,
            q: "",
            order_by: "created_at",
            sort_by: "desc",
            options: [
              [
                "filter,is_publish,equal,1",
                `filter,user.uuid,equal,${data?.user?.id}`,
              ],
            ],
          };
          getSimiliarPostUser([], query);
        } catch (error) {
          ErrorStatus(500, dispatch);
        }
      } else {
        ErrorStatus(500, dispatch);
      }
    });
  };

  const { width } = useWindowDimensions();

  const onPressButtonList = (buttonId: string) => {
    setButtonModal({ ...buttonModal, show: false });
    wait(500).then(() => {
      switch (buttonId) {
        case "edit-post":
          editPost();
          return;
        case "delete-post":
          removePost();
          return;
        case "report-post":
          reportPost();
          return;
        case "edit-komentar":
          editComment();
          return;
        case "delete-komentar":
          removeComment();
          return;
        case "report-komentar":
          reportComment();
          return;
        case "copy-komentar":
          copyComment();
          return;
        default:
          null;
      }
    });
  };

  const copyComment = () => {
    Clipboard.setString(commentSelected?.comment?.comment);
  };

  const reportComment = useCallback(() => {
    setShowModal({
      showModal: true,
      withTextInput: true,
      valueTextInput: reportText,
      onChangeTextInput: text => {
        setReportText(text);
      },
      withIcon: true,
      iconImage: icons.warningRed,
      leftText: t("kirim"),
      leftFunction: (text?: string) => {
        const dataBody: {
          notes: string;
          post_id?: string;
          type: number;
          comment_id?: string;
          status: string;
        } = {
          notes: text || "",
          type: 2,
          status: "",
          post_id: "",
          comment_id: commentSelected?.comment?.id,
        };

        setShowModal({
          showModal: false,
          title: "",
        });
        setReportText("");
        apiPostReportPost(auth?.accessToken, dataBody).then(({ data }) => {
          if (data) {
            wait(500).then(() => {
              setShowModal({
                showModal: true,
                titleBigJapan: "ありがとう",
                titleBig: "Terimakasih",
                title: t("laporan_berhasil_dibuat"),
                leftText: t("kembali"),
                leftFunction: () => {
                  setShowModal({ showModal: false, title: "" });
                },
              });
            });
          } else {
            ErrorStatus(500, dispatch);
          }
        });
      },
      rightText: t("batal"),
      rightFunction: () => {
        setReportText("");
        setShowModal({
          showModal: false,
          title: "",
        });
      },
    });
  }, [reportText, commentSelected]);

  const reportPost = useCallback(() => {
    setShowModal({
      showModal: true,
      withTextInput: true,
      valueTextInput: reportText,
      onChangeTextInput: text => {
        setReportText(text);
      },
      withIcon: true,
      iconImage: icons.warningRed,
      leftText: t("kirim"),
      leftFunction: (text?: string) => {
        const dataBody: {
          notes: string;
          post_id?: string;
          type: number;
          comment_id?: string;
          status: string;
        } = {
          notes: text || "",
          type: 1,
          status: "",
          post_id: route?.params?.id,
          comment_id: "",
        };

        setShowModal({
          showModal: false,
          title: "",
        });
        setReportText("");
        apiPostReportPost(auth?.accessToken, dataBody).then(({ data }) => {
          if (data) {
            wait(500).then(() => {
              setShowModal({
                showModal: true,
                titleBigJapan: "ありがとう",
                titleBig: "Terimakasih",
                title: t("laporan_berhasil_dibuat"),
                leftText: t("kembali"),
                leftFunction: () => {
                  setShowModal({ showModal: false, title: "" });
                },
              });
            });
          } else {
            ErrorStatus(500, dispatch);
          }
        });
      },
      rightText: t("batal"),
      rightFunction: () => {
        setReportText("");
        setShowModal({
          showModal: false,
          title: "",
        });
      },
    });
  }, [reportText]);

  const editComment = () => {
    const givenDate: any = new Date(commentSelected?.comment?.created_at);
    const currentDate: any = new Date();
    const timeDifference = currentDate - givenDate;
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDayMilliseconds) {
      setShowModal({
        titleBig: t("edit_komentar"),
        showModal: true,
        iconImage: icons.pencilRed,
        withIcon: true,
        subtitle: t("edit_komentar_description"),
        leftText: t("edit_komentar"),
        leftFunction: () => {
          setShowModal({
            showModal: false,
            title: "",
          });
          wait(500).then(() => {
            setShowBottomModal({
              ...showBottomModal,
              isShow: true,
              isNew: false,
              isReply: false,
            });
            setComment({
              text: commentSelected?.comment?.comment,
              parentId: commentSelected?.parent_id,
              commentId: commentSelected?.comment?.id,
            });
          });
        },

        rightText: t("batal"),
        rightFunction: () => {
          setShowModal({
            showModal: false,
            title: "",
          });
        },
      });
    }
  };

  const editPost = () => {
    const givenDate: any = new Date(forumDetail?.created_at);
    const currentDate: any = new Date();
    const timeDifference = currentDate - givenDate;
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDayMilliseconds) {
      setShowModal({
        titleBig: t("edit_postingan"),
        showModal: true,
        iconImage: icons.pencilRed,
        withIcon: true,
        subtitle: t("edit_postingan_description"),
        leftText: t("edit_postingan"),
        leftFunction: () => {
          setShowModal({
            showModal: false,
            title: "",
          });
          NavigationService.navigate("ForumEditorScreen", {
            id: route?.params?.id,
            from: "ForumDetailScreen",
          });
        },
        rightText: t("batal"),
        rightFunction: () => {
          setShowModal({
            showModal: false,
            title: "",
          });
        },
      });
    }
  };

  const removePost = () => {
    setShowModal({
      titleBig: t("hapus_postingan_kamu"),
      subtitle: t("hapus_postingan_description"),
      additionalText: t("edit_postingan"),
      additionalFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
        wait(500).then(() => {
          editPost();
        });
      },
      leftText: t("hapus"),
      leftFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
        wait(500).then(() => {
          setShowModal({
            iconImage: icons.trashRed,
            withIcon: true,
            showModal: true,
            titleBig: t("hapus_postingan"),
            subtitle: t("hapus_description"),
            leftText: t("hapus"),
            leftFunction: () => {
              apiDeleteForumDetail(auth?.accessToken, route?.params?.id).then(
                ({ success }) => {
                  if (success) {
                    setShowModal({
                      showModal: false,
                      title: "",
                    });
                    NavigationService.back();
                  } else {
                    ErrorStatus(500, dispatch);
                  }
                },
              );
            },
            rightText: t("batal"),
            rightFunction: () => {
              setShowModal({
                showModal: false,
                title: "",
              });
            },
          });
        });
      },
      rightText: t("batal"),
      rightFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
      },
      showModal: true,
      iconImage: icons.trashRed,
      withIcon: true,
    });
  };

  const removeComment = () => {
    setShowModal({
      titleBig: t("hapus_komentar_kamu"),
      subtitle: t("hapus_komentar_description"),
      additionalText: t("edit_komentar"),
      additionalFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
        wait(500).then(() => {
          editComment();
        });
      },
      leftText: t("hapus"),
      leftFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
        wait(500).then(() => {
          setShowModal({
            iconImage: icons.trashRed,
            withIcon: true,
            showModal: true,
            titleBig: t("hapus_komentar_kamu"),
            subtitle: t("hapus_komentar_confirmation"),
            leftText: t("hapus"),
            leftFunction: () => {
              apiDeleteComment(
                auth?.accessToken,
                commentSelected?.comment?.id,
              ).then(({ success }) => {
                if (success) {
                  setShowModal({
                    showModal: false,
                    title: "",
                  });
                  initData();
                  getDetail();
                } else {
                  ErrorStatus(500, dispatch);
                }
              });
            },
            rightText: t("batal"),
            rightFunction: () => {
              setShowModal({
                showModal: false,
                title: "",
              });
            },
          });
        });
      },
      rightText: t("batal"),
      rightFunction: () => {
        setShowModal({
          showModal: false,
          title: "",
        });
      },
      showModal: true,
      iconImage: icons.trashRed,
      withIcon: true,
    });
  };

  const onPressButtonModal = (
    parentId: string,
    comment: CommentType,
    userId: string,
  ) => {
    if (user?.id === userId) {
      setCommentSelected({ parent_id: parentId, comment: comment });
      setButtonModal({
        show: true,
        id: "",
        listButton: [
          { id: "edit-komentar", title: t("edit_komentar") },
          { id: "delete-komentar", title: t("hapus_komentar") },
        ],
      });
    } else {
      setCommentSelected({ parent_id: parentId, comment: comment });
      setButtonModal({
        show: true,
        id: "",
        listButton: [
          { id: "report-komentar", title: t("laporkan_komentar") },
          { id: "copy-komentar", title: "Salin Komentar" },
        ],
      });
    }
  };

  const onPressReplyModal = (
    parentId: string,
    type: string,
    replyTo?: string,
  ) => {
    setShowBottomModal({
      ...showBottomModal,
      isShow: true,
      isNew: false,
      isReply: true,
    });
    setComment({ ...comment, parentId: parentId, text: `[@${replyTo}] ` });
    wait(500).then(() => {
      commentRef?.current?.focus();
    });
  };

  const onPressReportPost = () => {
    if (forumDetail?.user?.id === user?.id) {
      setButtonModal({
        show: true,
        id: "",
        listButton: [
          { id: "edit-post", title: t("edit_postingan") },
          { id: "delete-post", title: t("hapus_postingan") },
        ],
      });
    } else {
      setButtonModal({
        show: true,
        id: "",
        listButton: [{ id: "report-post", title: t("laporkan_postingan") }],
      });
    }
  };

  const onPressShare = () => {
    Share.open({
      title: forumDetail?.title,
      url: URL_CMS + "/mobile/forum/" + route?.params?.id,
    });
  };

  const postComment = useCallback(() => {
    const dataHarsh = harshWord.map(item => item?.name);
    const highlightedTextSet = new Set();
    const hars = new RegExp(`(${dataHarsh.join("|")})`, "gi");
    const parts = comment?.text.split(hars);
    parts?.forEach((part: any) => {
      const isHighlighted = dataHarsh.some(
        searchTerm => part?.toLowerCase() === searchTerm?.toLowerCase(),
      );
      if (isHighlighted) {
        highlightedTextSet.add(part?.toLowerCase());
      }
    });
    const highlightedTextArray: any = [...highlightedTextSet];

    if (highlightedTextArray?.length > 0) {
      setShowBottomModal({
        ...showBottomModal,
        isShow: false,
        isNew: showBottomModal.isNew,
        isReply: showBottomModal.isReply,
      });
      wait(500).then(() => {
        setShowModal({
          withIcon: true,
          iconImage: icons.warningRed,
          showModal: true,
          titleBig: t("cek_komentar"),
          title: t("cek_komentar_description"),
          leftText: t("perbaiki"),
          listWorstText: highlightedTextArray,
          leftFunction: () => {
            setShowModal({ showModal: false, title: "" });
            wait(500).then(() => {
              setShowBottomModal({
                ...showBottomModal,
                isShow: true,
                isNew: showBottomModal?.isNew,
                isReply: showBottomModal?.isReply,
              });
            });
          },
        });
      });
    } else {
      if (!showBottomModal.isNew && !showBottomModal?.isReply) {
        apiPutComment(
          auth?.accessToken,
          comment.text,
          route?.params?.id,
          "",
          comment?.commentId,
        ).then(({ data }) => {
          getDetail();
          if (data) {
            const commentUpdate = [...commentList];
            commentUpdate.map(item => {
              if (item.id === comment?.parentId) {
                if (comment?.parentId === comment?.commentId) {
                  item.comment = comment?.text;
                } else {
                  item.child.map(itm => {
                    if (itm.id === comment?.commentId) {
                      itm.comment = comment?.text;
                    }
                  });
                }
              }
            });
            setCommentList(commentUpdate);
            setShowBottomModal({
              ...showBottomModal,
              isShow: false,
              isNew: false,
              isReply: false,
            });
            setComment({ text: "", parentId: "" });
          } else {
            ErrorStatus(500, dispatch);
          }
        });
      } else {
        apiPostComment(
          auth?.accessToken,
          comment.text,
          route?.params?.id,
          comment?.parentId,
        ).then(({ data }) => {
          getDetail();
          if (data) {
            if (comment?.parentId) {
              const query: QueryType = {
                type: "pagination",
                relations: ["user"],
                page: 1,
                limit:
                  //@ts-ignore
                  commentList[
                    commentList.findIndex(item => item.id === comment?.parentId)
                  ]?.page * 2,
                post_id: route?.params?.id,
                parent_id: comment?.parentId,
              };
              apiGetCommentList(auth?.accessToken, query).then(({ data }) => {
                const comments: CommentType[] = [];

                commentList.map(item => {
                  if (item.id === comment?.parentId) {
                    item.child = data;
                    item.total_child = item.total_child + 1;
                  }
                  comments.push(item);
                });

                setCommentList(comments);
              });
            } else {
              initData();
            }
            setShowBottomModal({
              ...showBottomModal,
              isShow: false,
              isNew: false,
              isReply: false,
            });
            setComment({ text: "", parentId: "" });
          } else {
            ErrorStatus(500, dispatch);
          }
        });
      }
    }
  }, [comment?.text, comment?.parentId, showBottomModal, comment?.commentId]);

  const commentLikeDislike = (parentId: string, comment: CommentType) => {
    setLoadingLike(true);
    const commentUpdate = [...commentList];

    if (comment.is_like_by_user === false) {
      apiForumLike(auth?.accessToken, { comment_id: comment.id }).then(
        ({ data }) => {
          if (data) {
            setCommentList(
              dataMapping(parentId, commentUpdate, comment, false, data),
            );
            setLoadingLike(false);
          } else {
            ErrorStatus(500, dispatch);
          }
        },
      );
    } else if (comment.is_like_by_user === true) {
      apiForumDislike(auth?.accessToken, comment?.like?.id).then(
        ({ success }) => {
          if (success) {
            setLoadingLike(false);
            setCommentList(dataMapping(parentId, commentUpdate, comment, true));
          } else {
            ErrorStatus(500, dispatch);
          }
        },
      );
    }
  };

  const dataMapping = (
    parentId: string,
    commentList: CommentType[],
    comment: CommentType,
    userIsLike: boolean,
    like?: LikeType,
  ) => {
    commentList.map(item => {
      if (item.id === parentId) {
        if (parentId === comment.id) {
          if (userIsLike) {
            item.count_like -= 1;
            item.is_like_by_user = false;
            //@ts-ignore
            item.like = null;
          } else {
            item.count_like += 1;
            item.is_like_by_user = true;

            item.like = {
              id: like?.id || "",
              description: like?.description || "",
              created_at: like?.created_at || "",
              updated_at: like?.updated_at || "",
            };
          }
        } else {
          item.child.map(itm => {
            if (itm.id === comment.id) {
              if (userIsLike) {
                itm.count_like -= 1;
                itm.is_like_by_user = false;
                //@ts-ignore
                itm.like = null;
              } else {
                itm.count_like += 1;
                itm.is_like_by_user = true;

                itm.like = {
                  id: like?.id || "",
                  description: like?.description || "",
                  created_at: like?.created_at || "",
                  updated_at: like?.updated_at || "",
                };
              }
            }
          });
        }
      }
    });
    return commentList;
  };

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={20} />
      <ScrollView
        style={{ paddingHorizontal: scaledHorizontal(25) }}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          {isLoading ? (
            <View>
              <Space height={100} />
              <ActivityIndicator size={"large"} color={colors.black} />
              <Space height={100} />
            </View>
          ) : (
            <View>
              <ForumHeader
                post={forumDetail}
                onPressSetting={onPressReportPost}
              />
              <Space height={20} />
              <RenderHTML
                contentWidth={width - 70}
                enableCSSInlineProcessing={true}
                source={{
                  html:
                    `<!DOCTYPE html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=${width}, initial-scale=1">
                            <link rel="stylesheet" href="https://use.typekit.net/oov2wcw.css">
                            <style type="text/css">
                              div {
                                max-width: ${width}px;
                                font-family: century-gothic, sans-serif;
                              }
                              div, p {padding: 0; margin: 0; font-family: century-gothic, sans-serif;}
                              
                            </style>
                          </head>
                        <body>
                        <div style="padding: 0px;">` +
                    content +
                    "</div></body></html>",
                }}
                tagsStyles={{
                  p: {
                    marginBottom: 10,
                    color: colors.black,
                    fontFamily: fonts.CenturyGothicRegular,
                    fontSize: 16,
                  },
                  br: {
                    marginBottom: 2,
                  },
                }}
                WebView={WebView}
                systemFonts={[fonts.CenturyGothicRegular]}
              />
              <Space height={20} />
              <Text size={10} color={colors.zinc500}>
                {t("update_terakhir")}:{" "}
                {formatTimestamp(forumDetail?.updated_at)}
              </Text>
              <Space height={30} />
              <View style={{ alignItems: "center" }}>
                <Button
                  onPress={onPressShare}
                  title={t("bagikan")}
                  style={{
                    alignSelf: "center",
                    paddingVertical: 7,
                    justifyContent: "flex-start",
                    borderWidth: 1,
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.black,
                    width: "30%",
                    borderRadius: 8,
                  }}
                  variant="CenturyGothicBold"
                  textType="bold"
                  textStyle={{ fontSize: 10 }}
                  icon={icons.share}
                  iconStyle={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    alignSelf: "flex-end",
                    marginRight: scaledHorizontal(10),
                  }}
                  innerStyle={{ alignItems: "center" }}
                />
                <Space height={10} />
                {!forumDetail?.is_like_by_user ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      disabled={loadingLike}
                      onPress={() => {
                        setLoadingLike(true);
                        apiForumLike(auth?.accessToken, {
                          post_id: route?.params?.id,
                        }).then(({ data }) => {
                          setLoadingLike(false);
                          if (data) {
                            const dataUpdated = { ...forumDetail };
                            dataUpdated.is_like_by_user = true;
                            dataUpdated.count_like += 1;
                            dataUpdated.like = {
                              id: data?.id,
                              description: data?.description,
                              created_at: data?.created_at,
                              updated_at: data?.updated_at,
                            };
                            dispatch(onGetDetailForumPost(dataUpdated));
                          } else {
                            ErrorStatus(500, dispatch);
                          }
                        });
                      }}
                    >
                      <Image
                        source={icons.forumLike}
                        style={{ height: 80, width: 80, resizeMode: "contain" }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      disabled={loadingLike}
                      style={{
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                        height: 50,
                        width: 50,
                        borderRadius: 50 / 2,
                        backgroundColor: colors.stone400,
                        paddingVertical: scaledVertical(10),
                        marginTop: scaledVertical(30),
                      }}
                      onPress={() => {
                        setLoadingLike(true);
                        apiForumDislike(
                          auth?.accessToken,
                          forumDetail?.like?.id,
                        ).then(({ success }) => {
                          setLoadingLike(false);
                          if (success) {
                            const data = { ...forumDetail };
                            data.is_like_by_user = false;
                            data.count_like -= 1;
                            dispatch(onGetDetailForumPost(data));
                          } else {
                            ErrorStatus(500, dispatch);
                          }
                        });
                      }}
                    >
                      <Image
                        source={icons.like}
                        style={{ height: 20, width: 20, resizeMode: "contain" }}
                      />
                      <Space height={5} />
                      <Text
                        textAlign={"center"}
                        size={10}
                        type="bold"
                        variant="CenturyGothicBold"
                        color={colors.white}
                      >
                        {forumDetail?.count_like}
                      </Text>
                    </TouchableOpacity>
                    <Space height={10} />
                    <Text lineHeight={24}>Arigatou !</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </Card>

        <Space height={25} />
        <CommentForum
          onCreateNewComment={() =>
            setShowBottomModal({
              ...showBottomModal,
              isShow: true,
              isNew: true,
            })
          }
          commentData={commentList}
          onPressButtonModal={onPressButtonModal}
          setCommentList={setCommentList}
          postId={route?.params?.id}
          token={auth?.accessToken}
          meta={commentListMeta}
          setCommentListMeta={setCommentListMeta}
          commentParam={commentParam}
          onPressReplyModal={onPressReplyModal}
          forumDetail={forumDetail}
          commentLikeDislike={commentLikeDislike}
        />
        <Space height={25} />
        {similiarPostUser && similiarPostUser.length > 0 && (
          <Card
            style={{
              borderRadius: 12,
              paddingHorizontal: scaledHorizontal(25),
            }}
          >
            <Text type="bold" variant="CenturyGothicBold" size={16}>
              {t("postingan_lain_dari")} {forumDetail?.user?.name}
            </Text>
            <Space height={15} />

            {similiarPostUser?.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      NavigationService.push("ForumDetailScreen", {
                        id: item?.id,
                      });
                    }}
                  >
                    <ForumPost post={item} />
                  </TouchableOpacity>
                  <Space height={10} />
                </View>
              );
            })}
          </Card>
        )}
        <Space height={25} />
        {trendingPost && trendingPost?.length > 0 ? (
          <View>
            <Card
              style={{
                borderRadius: 12,
                paddingHorizontal: scaledHorizontal(25),
              }}
            >
              <Text type="bold" variant="CenturyGothicBold" size={16}>
                {t("diskusi_trending")}
              </Text>
              <Space height={15} />
              {trendingPost.map((item, index) => {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        NavigationService.push("ForumDetailScreen", {
                          id: item?.id,
                        });
                      }}
                    >
                      <ForumPost post={item} />
                    </TouchableOpacity>
                    <Space height={10} />
                  </View>
                );
              })}
            </Card>
          </View>
        ) : null}

        {/* </View> */}
        <Space height={50} />
      </ScrollView>
      <Space height={20} />
      <Button
        onPress={() => {
          NavigationService.back();
        }}
        variant="CenturyGothicBold"
        textType="bold"
        type="light"
        style={{
          width: 38,
          height: 38,
          borderRadius: 38 / 2,
          alignSelf: "center",
        }}
        textStyle={{
          fontSize: 22,
          lineHeight: 18,
        }}
        icon={icons.iconX}
        iconStyle={{ width: 18, height: 18, resizeMode: "contain" }}
      />
      <Space height={30} />
      <ModalButtonList
        showModal={buttonModal.show}
        onClose={() => {
          setButtonModal({ ...buttonModal, show: false, id: "" });
        }}
        listButton={buttonModal.listButton}
        onPressButtonList={onPressButtonList}
      />
      <ModalAlert
        onHide={() => {
          setShowModal({ showModal: false, title: "" });
        }}
        showModal={showModal?.showModal}
        animation={"zoom"}
        title={showModal?.title}
        leftFunction={showModal.leftFunction}
        rightFunction={showModal.rightFunction}
        leftText={showModal.leftText}
        rightText={showModal.rightText}
        iconImage={showModal?.iconImage}
        withIcon={showModal?.withIcon}
        titleBig={showModal.titleBig}
        withTextInput={showModal?.withTextInput}
        valueTextInput={showModal?.valueTextInput}
        onChangeTextInput={showModal?.onChangeTextInput}
        titleBigJapan={showModal?.titleBigJapan}
        subtitle={showModal?.subtitle}
        withTime={showModal?.withTime}
        time={showModal?.time}
        additionalFunction={showModal?.additionalFunction}
        additionalText={showModal?.additionalText}
        listWorstText={showModal?.listWorstText}
        withMaximumTextInput
        withRequiredTextInput
        textInputPlaceholder={t("isi_laporan_kamu")}
        titleTextInput={t("isi_laporan_kamu_description")}
      />
      <BottomModal
        onClose={() => {
          setShowBottomModal({
            ...showBottomModal,
            isShow: false,
            isNew: false,
            isReply: false,
          });
          setComment({ text: "", parentId: "" });
        }}
        isVisible={showBottomModal?.isShow}
        backdropColor={colors.black}
      >
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: scaledVertical(10),
            paddingHorizontal: scaledHorizontal(10),
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              value={comment?.text}
              useRef={commentRef}
              withError={false}
              type="textarea"
              textAreaHeight={80}
              borderLess={false}
              onChange={e => {
                setComment({
                  text: e,
                  parentId: comment?.parentId,
                  commentId: comment?.commentId,
                });
              }}
              stylesBox={{ width: "95%" }}
              placeholder={
                showBottomModal?.isNew
                  ? t("tulis_komentar")
                  : showBottomModal?.isReply
                  ? t("balas_komentar")
                  : t("edit_komentar")
              }
              textStyle={{
                fontFamily: fonts.CenturyGothicRegular,
                textAlignVertical: "top",
                textAlign: "left",
              }}
            ></TextInput>
          </View>

          <Button
            onPress={postComment}
            variant="CenturyGothicBold"
            textType="bold"
            title={t("kirim")}
            type="light"
            style={{
              height: 32,
              paddingHorizontal: scaledHorizontal(15),
              marginTop: 10,
              borderRadius: 8,
            }}
            textStyle={{
              fontSize: 10,
              lineHeight: 18,
            }}
          />
        </View>
      </BottomModal>
    </View>
  );
};

export default ForumDetailScreen;
