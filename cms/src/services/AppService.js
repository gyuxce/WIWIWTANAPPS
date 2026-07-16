import ApiService from './ApiService';

export async function apiGetMenu(params) {
  return ApiService.fetchData({
    url: '/base/menus',
    method: 'get',
    params: params,
  });
}

export async function apiGetRole(params) {
  return ApiService.fetchData({
    url: '/base/roles',
    method: 'get',
    params: params,
  });
}

export async function apiGetConstants(params) {
  return ApiService.fetchData({
    url: '/constants',
    method: 'get',
    params: params,
  });
}

export async function apiGetCity(params) {
  return ApiService.fetchData({
    url: '/master/cities',
    method: 'get',
    params: params,
  });
}

export async function apiTemplate(params) {
  return ApiService.fetchData({
    url: '/base/tools/import-format',
    method: 'get',
    params: params,
    responseType: 'arraybuffer',
  });
}

export async function apiDashboardProgress(params = null) {
  return ApiService.fetchData({
    url: '/base/dashboard/progress',
    method: 'get',
    params: params,
  });
}

export async function apiDashboardStatistics(params = null) {
  return ApiService.fetchData({
    url: '/base/dashboard/statistics',
    method: 'get',
    params: params,
  });
}

export async function apiGetFilterRole(params) {
  return ApiService.fetchData({
    url: '/base/filter/roles',
    method: 'get',
    params: params,
  });
}
