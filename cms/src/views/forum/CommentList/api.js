import ApiService from 'services/ApiService';

export async function apiStoreComment(data) {
  return ApiService.fetchData({
    url: '/cms/forum/comments',
    method: 'post',
    data,
  });
}

export async function apiUpdateComment(id, data) {
  return ApiService.fetchData({
    url: '/cms/forum/comments' + '/' + id,
    method: 'put',
    data,
  });
}

export async function apiGetComment(id, params) {
  return ApiService.fetchData({
    url: '/cms/forum/comments' + '/' + id,
    method: 'get',
    params: params,
  });
}

export async function apiDeleteComment(id) {
  return ApiService.fetchData({
    url: '/cms/forum/comments' + '/' + id,
    method: 'delete',
  });
}
