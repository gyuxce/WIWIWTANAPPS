import { useDispatch, useSelector } from "react-redux";
import {
  apiForumPost,
  apiForumPostPublic,
  apiGetForumDetail,
  apiGetHarshWord,
  apiMyForumPost,
  apiTopicType,
} from "services/ForumServices";
import type { StoreStateType } from "stores";
import {
  onGetCategoryForumPost,
  onGetDetailForumPost,
  onGetForumDraft,
  onGetForumPost,
  onGetHarshWord,
  onGetMyForumPost,
  onGetPopulerPost,
  onGetSimiliarPostUser,
  onGetTopicType,
  onGetTrendingPost,
  onGetTrendingPostPublic,
} from "stores/forum/forumSlice";
import type { QueryType } from "types/QueryTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import type { ForumPostType } from "types/ForumTypes";

import { useAuth } from "./useAuth";

export const useForum = () => {
  const dispatch = useDispatch();
  const {
    topicType,
    forumSearch,
    metaSearch,
    harshWord,
    forumDetail,
    metaDraft,
    forumDraft,
    myForumPost,
    metaMyForumPost,
    trendingPost,
    metaPopulerPost,
    populerPost,
    metaTrendingPost,
    trendingPostPublic,
    metaTrendingPostPublic,
    categoryPostForum,
    metaCategoryPostForum,
    metaSimiliarPostUser,
    similiarPostUser,
  } = useSelector((state: StoreStateType) => state.forum);
  const { auth } = useAuth();

  const getTopicType = async (param?: QueryType) => {
    try {
      const resp = await apiTopicType(auth?.accessToken, param);
      if (resp?.data) {
        dispatch(onGetTopicType(resp?.data));
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

  const getPostForumSearch = async (
    data: ForumPostType[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetForumPost({ data: joinData, meta: resp?.meta }));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
        meta: resp?.meta,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getHarsWord = async (param?: QueryType) => {
    try {
      const resp = await apiGetHarshWord(auth?.accessToken, param);
      if (resp?.data) {
        dispatch(onGetHarshWord(resp?.data));
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

  const getForumDetail = async (id: string) => {
    try {
      const resp = await apiGetForumDetail(auth?.accessToken, id);

      if (resp?.data) {
        dispatch(onGetDetailForumPost(resp?.data));
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

  const getPostForumDraft = async (
    data: ForumPostType[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiMyForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetForumDraft({ data: joinData, meta: resp?.meta }));
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

  const getMyForumPost = async (data: ForumPostType[], param?: QueryType) => {
    try {
      const resp = await apiMyForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetMyForumPost({ data: joinData, meta: resp?.meta }));
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

  const getPopulerPost = async (data: ForumPostType[], param?: QueryType) => {
    try {
      const resp = await apiForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetPopulerPost({ data: joinData, meta: resp?.meta }));
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

  const getTrendingPost = async (data: ForumPostType[], param?: QueryType) => {
    try {
      const resp = await apiForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetTrendingPost({ data: joinData, meta: resp?.meta }));
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

  const getTrendingPostPublic = async (
    data: ForumPostType[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumPostPublic(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetTrendingPostPublic({ data: joinData, meta: resp?.meta }));
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

  const getCategoryPostForum = async (
    data: ForumPostType[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetCategoryForumPost({ data: joinData, meta: resp?.meta }));
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

  const getSimiliarPostUser = async (
    data: ForumPostType[],
    param?: QueryType,
  ) => {
    try {
      const resp = await apiForumPost(auth?.accessToken, param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetSimiliarPostUser({ data: joinData, meta: resp?.meta }));
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
    getForumDetail,
    forumDetail,
    metaSearch,
    forumSearch,
    getPostForumSearch,
    topicType,
    getTopicType,
    getHarsWord,
    harshWord,
    getPostForumDraft,
    metaDraft,
    forumDraft,
    myForumPost,
    metaMyForumPost,
    getMyForumPost,
    trendingPost,
    metaTrendingPost,
    populerPost,
    metaPopulerPost,
    getPopulerPost,
    getTrendingPost,
    getTrendingPostPublic,
    metaTrendingPostPublic,
    trendingPostPublic,
    getCategoryPostForum,
    metaCategoryPostForum,
    categoryPostForum,
    similiarPostUser,
    metaSimiliarPostUser,
    getSimiliarPostUser,
  };
};
