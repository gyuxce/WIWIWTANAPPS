import ForumNotification from "components/ForumNotification";
import Space from "components/Space";
import Text from "components/Text";
import colors from "configs/colors";
import { useAuth } from "hooks/useAuth";
import { useNotification } from "hooks/useNotification";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { apiReadNotification } from "services/NotificationServices";
import {
  onGetForumNotification,
  onGetTotalNotification,
} from "stores/notification/notificationSlice";
import type { MetaTypes } from "types/MetaTypes";
import type { ForumNotificationTypes } from "types/NotificationTypes";
import type { QueryType } from "types/QueryTypes";
import NavigationService from "utils/NavigationService";
import { scaledVertical } from "utils/ScaledService";
import { isCloseToBottom } from "utils/Utils";

interface ForumProps {
  data: ForumNotificationTypes[];
  meta: MetaTypes;
  query: QueryType;
}

const Forum = ({ data, meta, query }: ForumProps) => {
  const { getForumNotification, totalNotification } = useNotification();
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const { auth } = useAuth();

  const loadMoreForumNotification = () => {
    if (meta.current_page < meta.last_page) {
      setLoadingIndicator(true);
      getForumNotification(data, {
        ...query,
        options: [
          ...(query?.options || []),
          ["filter,category,in,forum-comment|forum-report|forum-post"],
        ],
        page: meta?.current_page + 1,
        limit: 5,
      }).then(() => {
        setLoadingIndicator(false);
      });
    }
  };
  const onPressCardForum = (
    index: number,
    id: string,
    postId: string,
    text: string,
  ) => {
    dispatch(onGetTotalNotification(totalNotification - 1));
    if (
      Array.isArray(data) &&
      index >= 0 &&
      index < data.length &&
      data[index]
    ) {
      const updatedNotification = { ...data[index], status: "read" };
      const updatedNotifications = [
        ...data.slice(0, index),
        updatedNotification,
        ...data.slice(index + 1),
      ];

      dispatch(
        onGetForumNotification({
          data: updatedNotifications as ForumNotificationTypes[],
          meta,
        }),
      );
      apiReadNotification(auth?.accessToken, id);
      if (text.includes("Postingan anda dihapus oleh")) {
        return;
      }
      NavigationService.navigate("ForumDetailScreen", { id: postId });
    }
  };
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      onScrollEndDrag={event => {
        if (isCloseToBottom(event.nativeEvent)) {
          if (!loadingIndicator) {
            loadMoreForumNotification();
          }
        }
      }}
    >
      {data.length > 0 ? (
        <View>
          {data.map((item, index) => {
            return (
              <View key={index}>
                <ForumNotification
                  index={index}
                  id={item.id}
                  onPress={onPressCardForum}
                  text={item.body}
                  title={item.title}
                  isReport={item.category === "forum-report"}
                  isRead={item.status === "read"}
                  created_at={item.created_at}
                  postId={item?.data?.post_id}
                />
                <Space height={20} />
              </View>
            );
          })}
          {loadingIndicator && (
            <View>
              <Space height={10} />
              <ActivityIndicator size={"large"} color={colors.black} />
            </View>
          )}
        </View>
      ) : (
        <View style={{ marginTop: scaledVertical(100), alignItems: "center" }}>
          <Text>Belum ada notifikasi</Text>
        </View>
      )}

      <Space height={70} />
    </ScrollView>
  );
};

export default Forum;
