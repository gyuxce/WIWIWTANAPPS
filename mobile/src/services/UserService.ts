import type { QueryType } from "types/QueryTypes";
import type { CityType } from "types/UserTypes";
import { convertToQuery } from "utils/Utils";

import BaseService from "./BaseService";
import { Platform } from "react-native";
import { ErrorStatus } from "utils/ErrorStatus";
import { API_URL } from '@env';

export const apiGetCityData = (param?: QueryType) => {
  return BaseService(
    "/master/cities?" + convertToQuery(param),
  ).get() as Promise<{ data: CityType[] }>;
};

export const apiConstant = (type: string) => {
  return BaseService(`/constants?data=${type}`).get();
};

export const apiFCMPost = (
  token: string,
  fcm_token: string,
  user_id: string,
) => {
  return BaseService(`/sailfish/fcm-token`)
    .headers({ Authorization: "Bearer " + token })
    .json({ token: fcm_token, os: Platform.OS, user_id: user_id })
    .post() as Promise<{ data: any }>;
};

export const apiUploadImage = async (
  token: string,
  formData: FormData,
  dispatch: any,
) => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  headers.append("Content-Type", "multipart/form-data");
  try {
    const response = await fetch(API_URL + "/files", {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      ErrorStatus(response?.status, dispatch);
      return { ok: false };
    }

    const result = await response.json(); // Use response.json() if the server returns JSON
    return result;
  } catch (error) {
    window.console.error("Upload error:", error);
  }
};

export const apiUpdateProfile = async (
  token: string,
  name: string,
  name_alias: string,
  email: string,
  phone: string,
  city_id: string,
  address: string,
  profile_pic_id: string,
  join_reason: string,
) => {
  return BaseService(`/mobile/base/users/update-profile`, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .post({
      name: name,
      name_alias: name_alias,
      email: email,
      phone: phone,
      city_id: city_id,
      address: address,
      profile_pic_id: profile_pic_id,
      join_reason: join_reason,
    }) as Promise<{ success: boolean }>;
};

export const apiGetUserDocs = (token: string, param?: QueryType) => {
  return BaseService(
    "/mobile/base/users/user-files?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: any[] }>;
};

export const apiUploadDocument = async (token: string, payload: any) => {
  const resp = await BaseService("/mobile/base/users/user-files")
    .content("multipart/form-data")
    .headers({ Authorization: `Bearer ${token}` })
    .post(payload);

  return resp;
};

export const apiUploadFile = async (token: string, payload: any) => {
  const resp = await BaseService("/files")
    .content("multipart/form-data")
    .headers({ Authorization: `Bearer ${token}` })
    .post(payload);

  return resp;
};

export const inactiveAccount = async (token: string) => {
  const resp = await BaseService("/mobile/base/users/inactivate-account", token)
    .headers({ Authorization: "Bearer " + token })
    .post();

  return resp;
};
