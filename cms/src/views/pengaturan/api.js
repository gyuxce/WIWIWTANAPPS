import ApiService from "services/ApiService";

export async function apiChangePassword(params) {
  return ApiService.fetchData({
    url: '/base/settings/change-password',
    method: "post",
    params: params,
  });
}

export async function apiDetailUser(id) {
  return ApiService.fetchData({
    url: '/base/users/' + id + '?relations=role,profilePicture',
    method: "get",
  });
}

export async function apiUpdateProfile(data) {
  return ApiService.fetchData({
    url: '/base/settings/update-profile',
    method: "post",
    data,
  });
}

export async function apiGetPhase() {
  return ApiService.fetchData({
    url: '/constants',
    method: "get",
    params:{
      data:'phase'
    }
  });
}