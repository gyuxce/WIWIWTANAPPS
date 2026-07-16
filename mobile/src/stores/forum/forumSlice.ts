import { createSlice } from "@reduxjs/toolkit";
import type {
  ForumPostType,
  ForumTopicType,
  HarshWordType,
} from "types/ForumTypes";
import type { MetaTypes } from "types/MetaTypes";

export type ForumState = {
  topicType: ForumTopicType[];
  forumSearch: ForumPostType[];
  metaSearch: MetaTypes;
  harshWord: HarshWordType[];
  forumDetail: ForumPostType;
  forumDraft: ForumPostType[];
  metaDraft: MetaTypes;
  myForumPost: ForumPostType[];
  metaMyForumPost: MetaTypes;
  populerPost: ForumPostType[];
  metaPopulerPost: MetaTypes;
  trendingPost: ForumPostType[];
  metaTrendingPost: MetaTypes;
  trendingPostPublic: ForumPostType[];
  metaTrendingPostPublic: MetaTypes;

  categoryPostForum: ForumPostType[];
  metaCategoryPostForum: MetaTypes;
  similiarPostUser: ForumPostType[];
  metaSimiliarPostUser: MetaTypes;
};

export const forumSlice = createSlice({
  name: "user",
  initialState: {
    topicType: [] as ForumTopicType[],
    forumSearch: [] as ForumPostType[],
    metaSearch: {} as MetaTypes,

    harshWord: [] as HarshWordType[],
    forumDetail: {} as ForumPostType,

    forumDraft: [] as ForumPostType[],
    metaDraft: {} as MetaTypes,

    myForumPost: [] as ForumPostType[],
    metaMyForumPost: {} as MetaTypes,
    populerPost: [] as ForumPostType[],
    metaPopulerPost: {} as MetaTypes,
    trendingPost: [] as ForumPostType[],
    metaTrendingPost: {} as MetaTypes,

    categoryPostForum: [] as ForumPostType[],
    metaCategoryPostForum: {} as MetaTypes,
    similiarPostUser: [] as ForumPostType[],
    metaSimiliarPostUser: {} as MetaTypes,
  } as ForumState,
  reducers: {
    onGetTopicType: (state, action: { payload: ForumTopicType[] }) => {
      state.topicType = action.payload;
    },
    onGetForumPost: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.forumSearch = action.payload.data;
      state.metaSearch = action.payload.meta;
    },
    onGetHarshWord: (state, action: { payload: HarshWordType[] }) => {
      state.harshWord = action.payload;
    },
    onGetDetailForumPost: (state, action: { payload: ForumPostType }) => {
      state.forumDetail = action.payload;
    },
    onGetForumDraft: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.forumDraft = action.payload?.data;
      state.metaDraft = action.payload.meta;
    },
    onGetMyForumPost: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.myForumPost = action.payload.data;
      state.metaMyForumPost = action.payload.meta;
    },
    onGetTrendingPost: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.trendingPost = action.payload.data;
      state.metaTrendingPost = action.payload.meta;
    },
    onGetTrendingPostPublic: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.trendingPostPublic = action.payload.data;
      state.metaTrendingPostPublic = action.payload.meta;
    },
    onGetPopulerPost: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.populerPost = action.payload.data;
      state.metaPopulerPost = action.payload.meta;
    },

    onGetCategoryForumPost: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.categoryPostForum = action.payload.data;
      state.metaCategoryPostForum = action.payload.meta;
    },
    onGetSimiliarPostUser: (
      state,
      action: { payload: { data: ForumPostType[]; meta: MetaTypes } },
    ) => {
      state.similiarPostUser = action.payload.data;
      state.metaSimiliarPostUser = action.payload.meta;
    },
  },
});

export const {
  onGetTopicType,
  onGetForumPost,
  onGetHarshWord,
  onGetDetailForumPost,
  onGetForumDraft,
  onGetMyForumPost,
  onGetPopulerPost,
  onGetTrendingPost,
  onGetTrendingPostPublic,
  onGetCategoryForumPost,
  onGetSimiliarPostUser,
} = forumSlice.actions;

export default forumSlice.reducer;
