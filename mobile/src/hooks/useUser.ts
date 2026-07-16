import { useDispatch, useSelector } from "react-redux";
import { apiGetCityData, apiGetUserDocs } from "services/UserService";
import type { StoreStateType } from "stores";
import {
  onGetCityData,
  onGetUserAdmin,
  onGetUserDocs,
} from "stores/user/userSlice";
import type { QueryType } from "types/QueryTypes";
import { apiGetSettingAdmin } from "services/ConstantServices";
import { Alert, Linking } from "react-native";
import type { SettingType } from "types/ConstantTypes";
import { onErrorState } from "stores/error/errorSlice";
import icons from "configs/icons";
import { KONTAK_ADMIN_SLUG } from "types/UserTypes";

import { useAuth } from "./useAuth";

export const useUser = () => {
  const dispatch = useDispatch();
  const { auth, user } = useAuth();
  const { cityData, statusTest, userDocs, userAdmin } = useSelector(
    (state: StoreStateType) => state.user,
  );

  const getCityData = async (param?: QueryType) => {
    try {
      const resp = await apiGetCityData(param);
      if (resp?.data) {
        dispatch(onGetCityData(resp?.data));
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
  const getUserDocs = async (param?: QueryType) => {
    try {
      const resp = await apiGetUserDocs(auth?.accessToken, param);
      dispatch(onGetUserDocs(resp?.data));
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (err) {
      return {
        status: "failed",
        message: err,
      };
    }
  };

  const getUserAdmin = async () => {
    try {
      const resp = await apiGetSettingAdmin(auth?.accessToken, {
        type: "collection",
        options: [["filter,group,equal,kontak-admin"]],
      });
      if (resp?.data) {
        dispatch(onGetUserAdmin(resp?.data));
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (err) {
      return {
        status: "failed",
        message: err,
      };
    }
  };

  const openAdminWhatsapp = async (isAdminPelatihan?: boolean) => {
    const slug =
      user?.training_program === 1
        ? KONTAK_ADMIN_SLUG.TITP
        : user?.training_program === 2
        ? KONTAK_ADMIN_SLUG.SSW
        : KONTAK_ADMIN_SLUG.PELATIHAN;
    const admin: any = userAdmin?.find(
      (item: SettingType) =>
        item?.slug === (isAdminPelatihan ? KONTAK_ADMIN_SLUG : slug),
    );

    if (admin) {
      const uri = `https://api.whatsapp.com/send/?phone=${admin?.value.replaceAll(
        "+",
        "",
      )}&type=phone_number`;
      await Linking.openURL(uri).catch(err => {
        Alert.alert("Errorr", err);
      });
    } else {
      dispatch(
        onErrorState({
          visible: true,
          text: "Admin tidak ditemukan",
          icon: icons.searchClose,
          withCloseIcon: true,
          withIcon: true,
        }),
      );
    }
  };

  return {
    cityData,
    getCityData,
    statusTest,
    userDocs,
    getUserDocs,
    getUserAdmin,
    userAdmin,
    openAdminWhatsapp,
  };
};
