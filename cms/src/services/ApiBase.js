import ApiService from 'services/ApiService';

export async function apiFile(data) {
  return ApiService.fetchData({
    url: '/files',
    method: 'post',
    data,
  });
}

export async function apiGetFile(id) {
  return ApiService.fetchData({
    url: `/files/${id}`,
    method: 'get',
    responseType: 'arraybuffer',
  });
}

export async function apiSetting() {
  return ApiService.fetchData({
    url: '/base/settings',
    method: 'get',
    params: {
      type: 'collection',
    },
  });
}

export async function apiSettingUpdate(data) {
  return ApiService.fetchData({
    url: '/base/settings/update',
    method: 'post',
    data,
  });
}

export async function apiConstantLanguage() {
  return ApiService.fetchData({
    url: '/constants',
    method: 'get',
    params: {
      data: 'language',
    },
  });
}
