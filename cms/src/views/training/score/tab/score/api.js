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
    url: '/training/student-report/detail/' + id,
    method: 'get',
    params: params,
  });
}

export async function apiUpdate(id, data) {
  return ApiService.fetchData({
    url: '/training/student-report/' + id,
    method: 'put',
    data,
  });
}

export async function apiUpdateNilai(data) {
  return ApiService.fetchData({
    url: '/training/student-report/update-report',
    method: 'post',
    data,
  });
}

export async function apiUpdateNilaiAsesmenLisan(data) {
  return ApiService.fetchData({
    url: '/training/student-report/update-report-assesment-verbal',
    method: 'post',
    data,
  });
}

export async function apiRepeatAssement(data) {
  return ApiService.fetchData({
    url: '/training/student-report/repeat-assesment',
    method: 'post',
    data,
  });
}

export async function apiRepeatAssementVerbal(data) {
  return ApiService.fetchData({
    url: '/training/student-report/repeat-assesment-verbal',
    method: 'post',
    data,
  });
}

export async function apiExport(id, params) {
  return ApiService.fetchData({
    url: '/training/student-report/detail/export/' + id,
    method: 'get',
    params: params,
    responseType: 'arraybuffer',
  });
}
