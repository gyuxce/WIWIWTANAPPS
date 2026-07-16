import ApiService from './ApiService';

export async function apiSignIn(data) {
  return ApiService.fetchData({
    url: '/auth/sign-in',
    method: 'post',
    data,
  });
}

export async function apiSignUp(data) {
  return ApiService.fetchData({
    url: '/sign-up',
    method: 'post',
    data,
  });
}

export async function apiUserMe(params) {
  return ApiService.fetchData({
    url: '/auth/user/me',
    method: 'get',
    params,
  });
}

export async function apiSignOut(data) {
  return ApiService.fetchData({
    url: '/auth/sign-out',
    method: 'post',
    data,
  });
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: '/passwords/forgot-password',
    method: 'post',
    data,
  });
}

export async function apiResetPassword(data, resetToken) {
  return ApiService.fetchData({
    url: `/passwords/reset-password/${resetToken}`,
    method: 'post',
    data,
  });
}
