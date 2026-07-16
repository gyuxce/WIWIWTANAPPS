import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import type {
  ForYouNotificationTypes,
  ForumNotificationTypes,
} from "types/NotificationTypes";
import type { QueryType } from "types/QueryTypes";
import {
  onGetForYouNotification,
  onGetForumNotification,
  onGetPriorityNotification,
  onGetTotalNotification,
} from "stores/notification/notificationSlice";
import { ErrorStatus } from "utils/ErrorStatus";
import {
  apiForumNotification,
  apiTotalNotification,
} from "services/NotificationServices";

import { useAuth } from "./useAuth";

export const useNotification = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const {
    forumNotificationList,
    metaForumNotification,
    totalNotification,
    forYouNotificationList,
    metaForYouNotification,
    priorityNotificationList,
    metaPriorityNotification,
  } = useSelector((state: StoreStateType) => state.notification);

  const getForumNotification = async (
    data: ForumNotificationTypes[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumNotification(auth?.accessToken, param);
      const joinData: any = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetForumNotification({ data: joinData, meta: resp?.meta }));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getForYouNotification = async (
    data: ForYouNotificationTypes[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumNotification(auth?.accessToken, param);
      const joinData: any = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetForYouNotification({ data: joinData, meta: resp?.meta }));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getPriorityNotification = async (
    data: ForYouNotificationTypes[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumNotification(auth?.accessToken, param);
      const joinData: any = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(
          onGetPriorityNotification({ data: joinData, meta: resp?.meta }),
        );
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getTotalNotification = async () => {
    try {
      const resp = await apiTotalNotification(auth?.accessToken);

      if (resp?.status) {
        dispatch(onGetTotalNotification(resp?.data));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  return {
    getForumNotification,
    metaForumNotification,
    forumNotificationList,
    totalNotification,
    getTotalNotification,
    metaForYouNotification,
    getForYouNotification,
    forYouNotificationList,
    getPriorityNotification,
    metaPriorityNotification,
    priorityNotificationList,
  };
};
