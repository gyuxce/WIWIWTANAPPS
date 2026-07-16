import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  hashWordsList: [],
  forumMyPostList: [],
  metaForumMyPostList: null,
  forumPostAdd: null,
  forumPostDetail: null,
  forumTopicsList: [],
};

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    onGetHashWordsListSuccess: (state, action) => {
      state.hashWordsList = action.payload;
    },
    onGetForumMyPostListSuccess: (state, action) => {
      state.forumMyPostList = action.payload.data;
      state.metaForumMyPostList = action.payload.meta;
    },
    onGetForumPostListSuccess: (state, action) => {
      state.forumPostList = action.payload.data;
      state.metaForumPostList = action.payload.meta;
    },
    onPostForumPostAddSuccess: (state, action) => {
      state.forumPostAdd = action.payload.data;
    },
    onGetForumPostDetailSuccess: (state, action) => {
      state.forumPostDetail = action.payload.data;
    },
    onGetTopicsForumSuccess: (state, action) => {
      state.forumTopicsList = action.payload.data;
    },
  },
});

export const {
  onGetHashWordsListSuccess,
  onGetForumMyPostListSuccess,
  onGetForumPostListSuccess,
  onPostForumPostAddSuccess,
  onGetForumPostDetailSuccess,
  onGetTopicsForumSuccess,
} = forumSlice.actions;

export default forumSlice.reducer;
