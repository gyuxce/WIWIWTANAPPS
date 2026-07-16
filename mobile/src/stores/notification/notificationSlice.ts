import { createSlice } from "@reduxjs/toolkit";
import type { MetaTypes } from "types/MetaTypes";
import type {
  ForYouNotificationTypes,
  ForumNotificationTypes,
} from "types/NotificationTypes";

export type NotificationState = {
  forumNotificationList: ForumNotificationTypes[];
  metaForumNotification: MetaTypes;
  totalNotification: number;

  forYouNotificationList: ForYouNotificationTypes[];
  metaForYouNotification: MetaTypes;

  priorityNotificationList: ForYouNotificationTypes[];
  metaPriorityNotification: MetaTypes;
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    forumNotificationList: [] as ForumNotificationTypes[],
    metaForumNotification: {} as MetaTypes,
    forYouNotificationList: [] as ForYouNotificationTypes[],
    metaForYouNotification: {} as MetaTypes,
    priorityNotificationList: [] as ForYouNotificationTypes[],
    metaPriorityNotification: {} as MetaTypes,
  } as NotificationState,
  reducers: {
    onGetForumNotification: (
      state,
      action: { payload: { data: ForumNotificationTypes[]; meta: MetaTypes } },
    ) => {
      state.forumNotificationList = action.payload.data;
      state.metaForumNotification = action.payload.meta;
    },
    onGetTotalNotification: (state, action: { payload: number }) => {
      state.totalNotification = action.payload;
    },
    onGetForYouNotification: (
      state,
      action: { payload: { data: ForYouNotificationTypes[]; meta: MetaTypes } },
    ) => {
      state.forYouNotificationList = action.payload.data;
      state.metaForYouNotification = action.payload.meta;
    },
    onGetPriorityNotification: (
      state,
      action: { payload: { data: ForYouNotificationTypes[]; meta: MetaTypes } },
    ) => {
      state.priorityNotificationList = action.payload.data;
      state.metaPriorityNotification = action.payload.meta;
    },
  },
});

export const {
  onGetForumNotification,
  onGetTotalNotification,
  onGetForYouNotification,
  onGetPriorityNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
