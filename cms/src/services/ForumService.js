import ApiService from './ApiService';

export async function apiGetHashWords(params = {}) {
  return ApiService.fetchData({
    url: 'base/harsh-words',
    method: 'get',
    params: {
      ...params,
    },
  });
}

export async function apiPostHashWords(data) {
  return ApiService.fetchData({
    url: 'base/harsh-words',
    method: 'post',
    data,
  });
}

export async function apiDeleteHashWords(id) {
  return ApiService.fetchData({
    url: `base/harsh-words/${id}`,
    method: 'delete',
  });
}

export async function apiForumMyPost(params = {}) {
  return ApiService.fetchData({
    url: `cms/forum/posts/myposts`,
    method: 'get',
    params: {
      ...params,
    },
  });
}

export async function apiForumPost(params = {}) {
  return ApiService.fetchData({
    url: `cms/forum/posts`,
    method: 'get',
    params: {
      ...params,
    },
  });
}

export async function apiDeleteForumPost(id, data) {
  return ApiService.fetchData({
    url: `cms/forum/posts/${id}`,
    method: 'post',
    data,
  });
}

export async function apiForumPostAdd(data) {
  return ApiService.fetchData({
    url: `cms/forum/posts`,
    method: 'post',
    data,
  });
}

export async function apiForumPostUpdate(id, data) {
  return ApiService.fetchData({
    url: `cms/forum/posts/${id}`,
    method: 'put',
    data,
  });
}

export async function apiForumPostDetail(id, params) {
  return ApiService.fetchData({
    url: `cms/forum/posts/${id}`,
    method: 'get',
    params: {
      ...params,
    },
  });
}

export async function apiGetTopicForum(params) {
  return ApiService.fetchData({
    url: `cms/forum/topics`,
    method: 'get',
    params: {
      ...params,
    },
  });
}
