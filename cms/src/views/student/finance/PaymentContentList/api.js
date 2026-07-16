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

export async function apiGetPaymentContent(id) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/' + id + '?relations=items.child',
    method: 'get',
  });
}

export async function apiSavePaymentContent(id, data) {
  return ApiService.fetchData({
    url: '/cms/finance/payment-content-items/add/' + id,
    method: 'post',
    data,
  });
}
