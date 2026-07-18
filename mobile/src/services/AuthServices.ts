import type {
  SocialAccountType,
  UserSignupProcessTypes,
  UserType,
} from "types/UserTypes";
import { API_URL } from "@env";
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";

import BaseService from "./BaseService";
export const apiForgotPassword = (email: string, redirect_url: string) => {
  return BaseService("/passwords/forgot-password").post({
    email: email,
    redirect_url: redirect_url,
    is_mobile: 1,
  }) as Promise<{ status: string }>;
};

export const apiResetPassword = (
  token: string,
  password: string,
  confirm_password: string,
) => {
  return BaseService(`/passwords/reset-password/${token}`).post({
    password: password,
    password_confirmation: confirm_password,
    is_mobile: 1,
  }) as Promise<{ status: string }>;
};

export const apiVerifyToken = (provider: string, accessToken: string) => {
  return BaseService(`/auth/${provider}/verify`).post({
    access_token: accessToken,
  }) as Promise<{ status: string }>;
};

export const apiSignup = (body: UserSignupProcessTypes) => {
  return BaseService("/auth/sign-up").json(body).post() as Promise<{
    data: { id: string };
    status?: string;
    message?: string;
  }>;
};

export const apiSignin = async (body: {
  email: string;
  password: string;
  is_mobile: string;
}) => {
  try {
    const result = await BaseService("/auth/sign-in")
      .json(body)
      .post() as {
      status?: string;
      data?: unknown;
      message?: string;
      errors?: unknown;
    };
    return {
      status: result?.status,
      data: result?.data,
      message: result?.message,
      errors: result?.errors,
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : String(error),
      error: error,
      data: null,
    };
  }
};

export const apiMe = (token: string) => {
  return BaseService("/auth/user/me?relations=profilePicture,city", token)
    .headers({ Authorization: "Bearer " + token })
    .get() as Promise<{
    data: UserType;
  }>;
};

export const apiLogout = (token: string) => {
  return BaseService("/auth/sign-out", token).post() as Promise<{
    status: string;
  }>;
};

export const apiUserConnect = (
  token: string,
  body: {
    adapter?: number;
    google_id?: string;
    facebook_id?: string;
    apple_id?: string;
  },
) => {
  return BaseService("/auth/user/connect-account", token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .json(body)
    .post();
};

export const apiPostSocialAccount = (socialToken: string) => {
  return BaseService("/auth/social-account")
    .json({ access_token: socialToken })
    .post() as Promise<SocialAccountType>;
};

export const apiChangePassword = async (
  token: string,
  body: {
    old_password: string;
    password: string;
    password_confirmation: string;
  },
  dispatch: any,
) => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);
  headers.append("Content-Type", "application/json");
  try {
    const response = await fetch(
      API_URL + "/mobile/base/users/change-password",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorResult = await response.json();

      dispatch(
        onErrorState({
          visible: true,
          text: errorResult?.message,
          icon: icons.searchClose,
          withCloseIcon: true,
          withIcon: true,
        }),
      );
      return { ok: false, error: errorResult, data: null };
    }

    const result = await response.json(); // Use response.json() if the server returns JSON
    return { ok: true, error: null, data: result };
  } catch (error) {
    return { ok: false, error: error, data: null };
  }
};
