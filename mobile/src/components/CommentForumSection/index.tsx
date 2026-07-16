import Button from "components/Button";
import Card from "components/Card";
import HighlightedCommentText from "components/HiglightedCommentText";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import icons from "configs/icons";
import images from "configs/images";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { apiGetCommentList } from "services/CommentServices";
import type { CommentType } from "types/CommentTypes";
import type { ForumPostType } from "types/ForumTypes";
import type { MetaTypes } from "types/MetaTypes";
import type { QueryType } from "types/QueryTypes";
import { scaledHorizontal, scaledVertical } from "utils/ScaledService";
import { formatTimestamp } from "utils/Utils";

interface CommentProps {
  onCreateNewComment: () => void;
  onPressButtonModal?: (
    parentId: string,
    comment: CommentType,
    userId: string,
  ) => void;
  onPressReplyModal?: (id: string, type: string, replyTo?: string) => void;
  commentData: CommentType[];
  setCommentList: any;
  postId: string;
  token: string;
  meta: MetaTypes;
  setCommentListMeta: (arg: MetaTypes) => void;
  commentParam: QueryType;
  forumDetail: ForumPostType;
  commentLikeDislike: (
    parentId: string,
    comment: CommentType,
    userId: string,
  ) => void;
}

const CommentForum = ({
  onCreateNewComment,
  onPressButtonModal,
  commentData,
  postId,
  setCommentList,
  token,
  meta,
  setCommentListMeta,
  commentParam,
  onPressReplyModal,
  forumDetail,
  commentLikeDislike,
}: CommentProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreComment = () => {
    setIsLoading(true);
    if (meta.current_page < meta.last_page) {
      const param = {
        type: "pagination",
        sort_by: "desc",
        order_by: "created_at",
        relations: ["user", "child", "child.user"],
        page: meta?.current_page + 1,
        limit: 3,
        post_id: postId,
      } as QueryType;
      apiGetCommentList(token, param).then(({ data, meta }) => {
        setCommentListMeta(meta);
        const comments = [
          ...commentData,
          ...data.map(item => {
            return { ...item, page: 1 };
          }),
        ];

        setCommentList(comments);
        setIsLoading(false);
      });
    } else {
      apiGetCommentList(token, commentParam).then(({ data, meta }) => {
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
        setIsLoading(false);
      });
    }
  };

  const toggleReplies = (
    parentId: string,
    page: number,
    isShowAllComment: boolean,
  ) => {
    if (isShowAllComment) {
      const data = [...commentData];
      data.map(item => {
        if (item.id === parentId) {
          item.page = 1;
          item.child = item.child.splice(0, 2);
        }
      });
      setCommentList(data);
    } else {
      const query: QueryType = {
        type: "pagination",
        relations: ["user"],
        page: page + 1,
        limit: 2,
        post_id: postId,
        parent_id: parentId,
      };
      setIsLoading(true);
      apiGetCommentList(token, query).then(({ data }) => {
        const comments: CommentType[] = [];

        commentData.map(item => {
          if (item.id === parentId) {
            item.child = [...item.child, ...data];
            item.page = page + 1;
          }
          comments.push(item);
        });

        setCommentList(comments);
        setIsLoading(false);
      });
    }
  };

  const CommentReply = (
    isShowAllComment: boolean,
    indexParent: string,
    totalComment: number,
    page: number,
    totalAllComment: number,
  ) => {
    return totalAllComment > 2 ? (
      <View>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={colors.black} />
        ) : (
          <TouchableOpacity
            onPress={() => toggleReplies(indexParent, page, isShowAllComment)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                height: 1,
                width: 35,
                backgroundColor: colors.black,
              }}
            />

            <Text
              size={12}
              type="bold"
              variant="CenturyGothicBold"
              color={colors.black}
            >
              {isShowAllComment
                ? t("sembunyikan_balasan")
                : `${t("lihat")} ${totalComment} ${"balasan_lainnya"}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ) : null;
  };

  const CommentAndReply = (
    data: CommentType | any,
    index: number,
    parentId: string,
    children?: any,
    withReply?: any,
  ) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          flex: 1,
          //marginBottom: scaledVertical(15),
        }}
      >
        <Image
          source={
            data?.user?.profilePicture
              ? { uri: data?.user?.profilePicture?.url }
              : images.userDefault
          }
          style={{
            height: 28,
            width: 28,
            resizeMode: "contain",
            borderRadius: 28 / 2,
          }}
        />
        <Space width={10} />
        <View
          style={{
            flexDirection: "row",
            //justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                size={12}
                type="bold"
                variant="CenturyGothicBold"
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              >
                {data?.user?.name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() =>
                    onPressButtonModal &&
                    onPressButtonModal(parentId, data, data?.user?.id)
                  }
                >
                  <Image
                    source={icons.report}
                    style={{
                      height: 28,
                      width: 28,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Space height={5} />

            <HighlightedCommentText text={data?.comment} />
            <Space height={10} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => {
                  commentLikeDislike(parentId, data, data?.user?.id);
                }}
              >
                <Image
                  source={icons.likeBorder}
                  style={{ height: 16, width: 16, resizeMode: "contain" }}
                />
              </TouchableOpacity>
              <Text
                size={10}
                style={{ marginLeft: 5, marginRight: 10 }}
                type="bold"
                variant="CenturyGothicBold"
              >
                {data?.count_like}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  onPressReplyModal &&
                  onPressReplyModal(parentId, "reply-section", data?.user?.name)
                }
              >
                <Text
                  size={10}
                  style={{ marginLeft: 5 }}
                  type="bold"
                  variant="CenturyGothicBold"
                >
                  {t("balas")}
                </Text>
              </TouchableOpacity>

              <Text
                size={10}
                style={{ fontWeight: "400", marginLeft: 12 }}
                color={colors.zinc500}
              >
                {formatTimestamp(data?.created_at)}
              </Text>
            </View>
            {withReply ? (
              <View>
                <Space height={20} />
                {withReply}
              </View>
            ) : null}
            {children ? (
              <View>
                <Space height={25} />
                {children}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const CommentField = () => {
    const component: React.JSX.Element[] = [];

    commentData.map((item, index) => {
      const child: React.JSX.Element[] = [];

      if (item.child) {
        item.child.map((reply, idx) => {
          return child.push(
            CommentAndReply(
              reply,
              idx,
              item?.id,
              [],
              idx === item?.child?.length - 1 &&
                CommentReply(
                  item?.total_child === item?.child?.length,
                  item?.id,
                  item?.total_child - item?.child?.length,
                  item?.page || 2,
                  item.total_child,
                ),
            ),
          );
        });
      }

      component.push(CommentAndReply(item, index, item.id, child));
    });

    return component;
  };

  return (
    <Card>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Text type="bold" variant="CenturyGothicBold">
          {t("komentar")}
        </Text>
        <View
          style={{
            padding: 6,
            borderRadius: 4,
            backgroundColor: colors.stone100,
          }}
        >
          <Text size={12} type="bold" variant="CenturyGothicBold">
            {forumDetail?.count_comment || 0}
          </Text>
        </View>
      </View>
      <Space height={20} />
      <Button
        onPress={onCreateNewComment}
        variant="CenturyGothicBold"
        textType="bold"
        title={t("tulis_komentar")}
        type="light"
        style={{ paddingVertical: 12 }}
        textStyle={{
          fontSize: 12,
          lineHeight: 18,
        }}
      />
      <Space height={20} />
      {
        <View>
          {commentData.length > 0 ? (
            <View>
              {CommentField()}
              {meta.current_page < meta?.last_page ? (
                <TouchableOpacity
                  onPress={loadMoreComment}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: scaledHorizontal(25),
                    paddingBottom: scaledVertical(20),
                  }}
                >
                  <View
                    style={{
                      height: 1,
                      width: 35,
                      backgroundColor: colors.black,
                    }}
                  />
                  <Text size={12} type="bold" variant="CenturyGothicBold">
                    {`${
                      meta?.current_page < meta?.last_page
                        ? `${"lihat"} ${meta?.total - commentData?.length} ${t(
                            "balasan_lainnya",
                          )}`
                        : t("sembunyikan_balasan")
                    } `}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <Text size={14}>{t("belum_ada_komentar")}</Text>
          )}
        </View>
      }
    </Card>
  );
};

export default CommentForum;
