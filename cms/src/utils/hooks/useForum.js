import { useDispatch, useSelector } from 'react-redux';
import {
  apiDeleteHashWords,
  apiForumMyPost,
  apiForumPost,
  apiForumPostAdd,
  apiForumPostDetail,
  apiGetHashWords,
  apiGetTopicForum,
  apiPostHashWords,
  apiDeleteForumPost,
} from 'services/ForumService';
import {
  onGetForumMyPostListSuccess,
  onGetForumPostDetailSuccess,
  onGetForumPostListSuccess,
  onGetHashWordsListSuccess,
  onGetTopicsForumSuccess,
  onPostForumPostAddSuccess,
} from 'store/forum';

function useForum() {
  const dispatch = useDispatch();
  const {
    hashWordsList,
    forumMyPostList,
    metaForumMyPostList,
    forumPostList,
    metaForumPostList,
    forumPostAdd,
    forumPostDetail,
    forumTopicsList,
  } = useSelector((state) => state.forum);

  const getListHashWords = async (params) => {
    try {
      const resp = await apiGetHashWords(params);
      if (resp.data) {
        const { data } = resp.data;
        dispatch(onGetHashWordsListSuccess(data));
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  const postHashWords = async (data) => {
    try {
      const resp = await apiPostHashWords(data);
      if (resp.data) {
        const { data } = resp.data;
        return {
          status: 'success',
          data: data,
        };
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const deleteHashWords = async (data) => {
    try {
      const resp = await apiDeleteHashWords(data);
      if (resp.data) {
        const { data } = resp.data;
        return {
          status: 'success',
          data: data,
        };
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const getListForumMyPost = async (params) => {
    try {
      const resp = await apiForumMyPost(params);
      if (resp.data) {
        dispatch(onGetForumMyPostListSuccess(resp.data));
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const getListForumPost = async (params) => {
    try {
      const resp = await apiForumPost(params);
      if (resp.data) {
        dispatch(onGetForumPostListSuccess(resp.data));
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const addForumPost = async (params) => {
    try {
      const resp = await apiForumPostAdd(params);
      if (resp.data) {
        dispatch(onPostForumPostAddSuccess(resp.data));
      }
      return resp.data;
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const getDetailForumPost = async (id, params) => {
    try {
      const resp = await apiForumPostDetail(id, params);
      if (resp.data) {
        dispatch(onGetForumPostDetailSuccess(resp.data));
      }
      return resp.data;
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const getTopicsForum = async (param) => {
    try {
      const resp = await apiGetTopicForum(param);
      if (resp.data) {
        dispatch(onGetTopicsForumSuccess(resp.data));
      }
      return resp.data.data;
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const deleteForumPost = async (id, data) => {
    try {
      const resp = await apiDeleteForumPost(id, data);
      if (resp.data) {
        const { data } = resp.data;
        return {
          status: 'success',
          data: data,
        };
      }
    } catch (errors) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  return {
    getListHashWords,
    hashWordsList,
    postHashWords,
    deleteHashWords,
    getListForumMyPost,
    forumMyPostList,
    metaForumMyPostList,
    getListForumPost,
    forumPostList,
    metaForumPostList,
    addForumPost,
    forumPostAdd,
    getDetailForumPost,
    forumPostDetail,
    getTopicsForum,
    forumTopicsList,
    deleteForumPost,
  };
}

export default useForum;
