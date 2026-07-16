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

export async function apiImport(data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/import',
    method: 'post',
    data,
  });
}

export async function apiSendNotification(data) {
  return ApiService.fetchData({
    url: '/master/content-notifications',
    method: 'post',
    data,
  });
}

export async function apiSavePratestLanguage(data) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/pratest/language',
    method: 'post',
    data,
  });
}

export async function apiGetPratestLanguage() {
  return ApiService.fetchData({
    url: '/training/exam-template-items/pratest',
    method: 'get',
    params: {
      template: 'language',
    },
  });
}

export async function apiAddContentLanguage(data) {
  return ApiService.fetchData({
    url: '/training/exam-template-items',
    method: 'post',
    data,
  });
}

export async function apiUpdateContentLanguage(id, data) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/' + id,
    method: 'put',
    data,
  });
}

export async function apiDeleteContentLanguage(id) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/' + id,
    method: 'delete',
  });
}

export async function apiGetQuestionLanguage(sesi_id) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/question/' + sesi_id,
    method: 'get',
  });
}

export async function apiPostQuestionLanguage(data) {
  return ApiService.fetchData({
    url: '/training/exam-template-items/question',
    method: 'post',
    data,
  });
}

export async function apiReminderPratestLanguage(id, data) {
  return ApiService.fetchData({
    url: PageConfig.baseEnpoint + '/reminder-pratest-language/' + id,
    method: 'post',
    data,
  });
}
