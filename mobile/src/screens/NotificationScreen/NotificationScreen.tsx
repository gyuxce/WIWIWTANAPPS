import Button from "components/Button";
import Header from "components/Header";
import Space from "components/Space";
import colors from "configs/colors";
import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import globalStyles from "utils/GlobalStyles";
import { scaledHorizontal } from "utils/ScaledService";
import { useNotification } from "hooks/useNotification";
import { useAuth } from "hooks/useAuth";
import type {
  ForYouNotificationTypes,
  ForumNotificationTypes,
} from "types/NotificationTypes";
import type { QueryType } from "types/QueryTypes";

import Priority from "./Priority/Priority";
import ForYou from "./ForYou/ForYou";
import Forum from "./Forum/Forum";
const NotificationScreen = () => {
  const [selectedNotification, setSelectedNotification] = useState(0);
  const {
    metaForumNotification,
    forumNotificationList,
    getForumNotification,
    forYouNotificationList,
    getForYouNotification,
    metaForYouNotification,
    getPriorityNotification,
    priorityNotificationList,
    metaPriorityNotification,
  } = useNotification();
  const { user } = useAuth();
  const [forumNotificationQuery] = useState({
    type: "pagination",
    relations: ["user"],
    page: 1,
    limit: 5,
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,user.uuid,equal," + user.id]],
  } as QueryType);
  const [forYouNotificationQuery] = useState({
    type: "pagination",
    relations: ["user"],
    page: 1,
    limit: 5,
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,user.uuid,equal," + user.id]],
  } as QueryType);
  const [priorityNotificationQuery] = useState({
    type: "pagination",
    relations: ["user"],
    page: 1,
    limit: 5,
    q: "",
    order_by: "created_at",
    sort_by: "desc",
    options: [["filter,user.uuid,equal," + user.id]],
  } as QueryType);
  const typeNotification = [
    {
      id: 0,
      name: "Prioritas",
    },
    {
      id: 1,
      name: "Untukmu",
    },
    {
      id: 2,
      name: "Forum",
    },
  ];

  useEffect(() => {
    getForumNotification([] as ForumNotificationTypes[], {
      ...forumNotificationQuery,
      options: [
        ...(forumNotificationQuery?.options || []),
        ["filter,category,in,forum-comment|forum-report|forum-post"],
      ],
    });
    getForYouNotification([] as ForYouNotificationTypes[], {
      ...forYouNotificationQuery,
      options: [
        ...(forYouNotificationQuery?.options || []),
        ["filter,category,in,content-notification|user|user-file"],
      ],
    });
    getPriorityNotification([] as ForYouNotificationTypes[], {
      ...priorityNotificationQuery,
      options: [
        ...(priorityNotificationQuery?.options || []),
        ["filter,category,in,payment-proof"],
      ],
    });
  }, []);

  return (
    <View style={globalStyles().topSafeArea}>
      <Space height={Platform.OS === "android" ? 15 : 0} />
      <Header
        textJapan="通知"
        textTitle={"Notifikasi"}
        withTextTitle
        withBackButton
      />
      <Space height={20} />
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          marginHorizontal: scaledHorizontal(100),
          justifyContent: "center",
        }}
      >
        {typeNotification.map((item, index) => {
          return (
            <Button
              key={index}
              title={item?.name}
              onPress={() => setSelectedNotification(item?.id)}
              style={{
                borderRadius: 8,
                borderLeftWidth: selectedNotification === item?.id ? 1 : 0,
                borderRightWidth: selectedNotification === item?.id ? 1 : 0,
                borderTopWidth: selectedNotification === item?.id ? 1 : 0,
                borderBottomWidth: selectedNotification === item?.id ? 1 : 0,
                paddingVertical: 9,
                paddingHorizontal: 10,
                backgroundColor:
                  selectedNotification === item?.id
                    ? colors.white
                    : "transparent",
              }}
            />
          );
        })}
      </View>

      <Space height={10} />
      {selectedNotification === 0 && (
        <Priority
          data={priorityNotificationList}
          meta={metaPriorityNotification}
          query={priorityNotificationQuery}
        />
      )}
      {selectedNotification === 1 && (
        <ForYou
          data={forYouNotificationList}
          meta={metaForYouNotification}
          query={forYouNotificationQuery}
        />
      )}
      {selectedNotification === 2 && (
        <Forum
          data={forumNotificationList}
          meta={metaForumNotification}
          query={forumNotificationQuery}
        />
      )}
    </View>
  );
};

export default NotificationScreen;
