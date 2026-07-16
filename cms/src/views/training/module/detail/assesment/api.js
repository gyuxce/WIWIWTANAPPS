import ApiService from 'services/ApiService';
import { PageConfig } from './config';

export async function apiIndex(params) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint,
    method: 'get',
    params: params,
  });
}

export async function apiShow(id, params) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/' + id,
    method: 'get',
    params: params,
  });
}

export async function apiStore(data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint,
    method: 'post',
    data,
  });
}

export async function apiUpdate(id, data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/' + id,
    method: 'put',
    data,
  });
}

export async function apiUpdateStatus(data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/update_status',
    method: 'post',
    data,
  });
}

export async function apiUploadFile(data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/upload_file',
    method: 'post',
    data,
  });
}

export async function apiDestroy(id, params) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/' + id,
    method: 'delete',
    params,
  });
}

export async function apiExport(params) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/export',
    method: 'get',
    params: params,
    responseType: 'arraybuffer',
  });
}
