import ApiService from 'services/ApiService';
import { PageConfig } from './config';

export async function apiIndex(params, id) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/' + id,
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
