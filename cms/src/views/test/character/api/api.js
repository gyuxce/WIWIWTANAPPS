import ApiService from 'services/ApiService';
import { PageConfig } from '../studentes/config';

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

export async function apiExport(params) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/export',
    method: 'get',
    params: params,
    responseType: 'arraybuffer',
  });
}

export async function apiDownload(file_id) {
  return ApiService.fetchData({
    url: `/base/user-files/download/${file_id}`,
    method: 'get',
    responseType: 'arraybuffer',
  });
}
export async function apiSavePratestCharacter(data) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/pratest/character',
    method: 'post',
    data,
  });
}

export async function apiGetPratestCharacter() {
  return ApiService.fetchData({
    url: '/training/exam-template-items/pratest',
    method: 'get',
    params: {
      template: 'character',
    },
  });
}

export async function apiSaveContentCharacter(id, data) {
  return ApiService.fetchData({
    url: '/training/exam-templates/' + id,
    method: 'put',
    data,
  });
}

export async function apiGetExamTemplates(params) {
  return ApiService.fetchData({
    url: '/training/exam-templates',
    method: 'get',
    params,
  });
}
