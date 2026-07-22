import { useDispatch, useSelector } from "react-redux";
import {
  apiForgotPassword,
  apiLogout,
  apiMe,
  apiRefreshToken,
  apiResetPassword,
  apiSignin,
  apiSignup,
  apiVerifyToken,
} from "services/AuthServices";
import type { StoreStateType } from "stores";
import { onChangeLanguage, onLogin } from "stores/persist/persistSlice";
import type { AuthType, UserSignupProcessTypes } from "types/UserTypes";
import { ErrorStatus } from "utils/ErrorStatus";
import { URL_CMS } from '@env';
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";
import { useTranslation } from "react-i18next";
import { apiGetPengaturanBahasa } from "services/ConstantServices";

type postResponse = {
  id: null|String;
  message: null|string|any;
  status: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { auth, user, name_katakana } = useSelector(
    (state: StoreStateType) => state.persist,
  );
  const { i18n } = useTranslation();

  const postForgotPassword = async (email: string) => {
    try {
      const resp = await apiForgotPassword(
        email,
        URL_CMS + "/reset-password",
      );
      return {
        status: resp?.status,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postResetPassword = async (
    token: string,
    password: string,
    confirm_password: string,
  ) => {
    try {
      const resp = await apiResetPassword(token, password, confirm_password);
      return {
        status: resp?.status,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postVerifyToken = async (provider: string, accessToken: string) => {
    try {
      const resp: any = await apiVerifyToken(provider, accessToken);

      if (resp.status === "error") {
        ErrorStatus(resp, dispatch);
      }

      if (resp === 401) {
        return {
          data: resp?.data,
          status: "fail",
          message: "",
        };
      }

      return {
        data: resp?.data,
        status: resp?.status,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postSignup = async (body: UserSignupProcessTypes): Promise<postResponse> => {
    try {
      const resp = await apiSignup(body);
      if (resp?.status) {
        dispatch(
          onErrorState({
            visible: true,
            text:
              resp?.message ||
              "This email has already been registered",
            icon: icons.searchClose,
            withCloseIcon: true,
            withIcon: true,
          }),
        );
      }
      return {
        status: "success",
        id: resp?.data?.id,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        id: null,
        message: errors,
      };
    }
  };

  const postLogout = async (token: string) => {
    try {
      const resp = await apiLogout(token);
      if (resp.status !== "success") {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getMe = async (token: string, authToken: AuthType) => {
    try {
      let activeAuthToken = authToken;
      let resp: any = await apiMe(token);

      if (resp === 401 && authToken?.refreshToken) {
        const refreshResp: any = await apiRefreshToken(authToken.refreshToken);
        const refreshedAccessToken = refreshResp?.data?.access_token;
        const refreshedRefreshToken =
          refreshResp?.data?.refresh_token || authToken.refreshToken;

        if (refreshResp?.status === "success" && refreshedAccessToken) {
          activeAuthToken = {
            accessToken: refreshedAccessToken,
            refreshToken: refreshedRefreshToken,
          };
          resp = await apiMe(refreshedAccessToken);
        }
      }

      if (resp?.data) {
        dispatch(onLogin({ auth: activeAuthToken, user: resp?.data }));
        try {
          const settingResp = await apiGetPengaturanBahasa(
            activeAuthToken.accessToken,
          );
          const settingValue = settingResp?.data?.[0]?.value;
          if (settingValue) {
            if (String(resp?.data?.last_phase) >= settingValue) {
              dispatch(onChangeLanguage("ja"));
              i18n.changeLanguage("ja");
            } else {
              i18n.changeLanguage("id");
              dispatch(onChangeLanguage("id"));
            }
          }
        } catch {
          // Language settings should not invalidate an otherwise valid login.
        }

        return {
          data: resp?.data,
          status: "success",
          message: "",
        };
      } else {
        ErrorStatus(401, dispatch);
      }
      return {
        data: resp?.data,
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postSignin = async (body: {
    email: string;
    password: string;
    is_mobile: string;
  }) => {
    try {
      const resp: any = await apiSignin(body);
      return {
        status: resp?.status,
        data: resp?.data,
        message: resp?.message,
        errors: resp?.errors,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  return {
    postForgotPassword,
    postResetPassword,
    postVerifyToken,
    postSignup,
    postLogout,
    auth,
    user,
    getMe,
    postSignin,
    name_katakana,
  };
};
