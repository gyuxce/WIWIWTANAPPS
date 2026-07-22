import PriorityNotification from "components/PriorityNotification";
import Space from "components/Space";
import Text from "components/Text";
import icons from "configs/icons";
import { useAuth } from "hooks/useAuth";
import { useNotification } from "hooks/useNotification";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { apiReadNotification } from "services/NotificationServices";
import {
  onGetTotalNotification,
  onGetForYouNotification,
} from "stores/notification/notificationSlice";
import { MetaTypes } from "types/MetaTypes";
import { ForYouNotificationTypes } from "types/NotificationTypes";
import { QueryType } from "types/QueryTypes";
import NavigationService from "utils/NavigationService";
import { scaledVertical } from "utils/ScaledService";
import { isCloseToBottom } from "utils/Utils";
import { useTranslation } from "react-i18next";

interface PriorityProps {
  data: ForYouNotificationTypes[];
  meta: MetaTypes;
  query: QueryType;
}

const Priority = ({ data, meta, query }: PriorityProps) => {
  const { t } = useTranslation();
  const { getForYouNotification, totalNotification } = useNotification();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const loadMoreForYouNotification = () => {
    if (meta.current_page < meta.last_page) {
      setLoadingIndicator(true);
      getForYouNotification(data, {
        ...query,
        options: [
          ...(query?.options || []),
          ["filter,category,in,payment-proof"],
        ],
        page: meta?.current_page + 1,
        limit: 5,
      }).then(() => {
        setLoadingIndicator(false);
      });
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      onScrollEndDrag={event => {
        if (isCloseToBottom(event.nativeEvent)) {
          if (!loadingIndicator) {
            loadMoreForYouNotification();
          }
        }
      }}
    >
      {data?.length > 0 ? (
        <View>
          {data?.map((item, index) => {
            return (
              <PriorityNotification
                key={index}
                text={item?.body}
                isRead={item.status === "read"}
                iconType={
                  item.category === "payment-proof" ? icons.wallet : icons.flag
                }
                date={item?.created_at}
                onPress={() => {
                  dispatch(onGetTotalNotification(totalNotification - 1));
                  if (
                    Array.isArray(data) &&
                    index >= 0 &&
                    index < data.length &&
                    data[index]
                  ) {
                    const updatedNotification = {
                      ...data[index],
                      status: "read",
                    };
                    const updatedNotifications = [
                      ...data.slice(0, index),
                      updatedNotification,
                      ...data.slice(index + 1),
                    ];

                    dispatch(
                      onGetForYouNotification({
                        data: updatedNotifications as ForYouNotificationTypes[],
                        meta,
                      }),
                    );
                    apiReadNotification(auth?.accessToken, item?.id);
                    if (item.category === "payment-proof") {
                      NavigationService.replace("PaymentAdministration");
                    }
                  }
                }}
              />
            );
          })}
        </View>
      ) : (
        <View style={{ marginTop: scaledVertical(100), alignItems: "center" }}>
          <Text>{t("belum_ada_notifikasi")}</Text>
        </View>
      )}
      {/* <PriorityNotification
        text="Selamat, kamu telah menyelesaikan fase [Pelatihan]! Fase selanjutnya adalah [JLPT], persiapkan dirimu."
        isRead={false}
        iconType={icons.flag}
      />
      <Space height={20} /> */}

      <Space height={70} />
    </ScrollView>
  );
};

export default Priority;
