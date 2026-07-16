import type { QueryType } from "types/QueryTypes";
import type {
  ForYouNotificationTypes,
  ForumNotificationTypes,
} from "types/NotificationTypes";
import type { MetaTypes } from "types/MetaTypes";
import { convertToQuery } from "utils/Utils";

import BaseService from "./BaseService";

export const apiForumNotification = (token: string, param?: QueryType) => {
  return BaseService("/mobile/notifications?" + convertToQuery(param), token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{
    data: ForumNotificationTypes[] | ForYouNotificationTypes[];
    meta: MetaTypes;
  }>;
};

export const apiTotalNotification = (token: string) => {
  return BaseService("/mobile/notifications/total", token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{
    data: number;
    status: boolean;
  }>;
};

export const apiReadNotification = (token: string, id: string) => {
  return BaseService("/mobile/notifications/read/" + id, token)
    .headers({ Authorization: "Bearer " + token })
    .post() as Promise<{ success: boolean }>;
};
