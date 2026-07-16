import { useDispatch, useSelector } from "react-redux";
import { StoreStateType } from "stores";
import { useAuth } from "./useAuth";
import { QueryType } from "types/QueryTypes";
import {
  apiCertificationList,
  apiCertificationUser,
} from "services/CertificationServices";
import {
  onGetCertificationList,
  onGetCertificationUser,
} from "stores/certification/certificationSlice";
import { ErrorStatus } from "utils/ErrorStatus";

export const useCertification = () => {
  const dispatch = useDispatch();
  const { certificationList, certificationUser } = useSelector(
    (state: StoreStateType) => state.certification,
  );

  const { auth } = useAuth();
  const getCertificationList = async (param: QueryType) => {
    try {
      const resp = await apiCertificationList(auth?.accessToken, param);
      if (resp) {
        dispatch(onGetCertificationList(resp?.data));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getCertificationUser = async (param: QueryType) => {
    try {
      const resp = await apiCertificationUser(auth?.accessToken, param);
      if (resp) {
        dispatch(onGetCertificationUser(resp?.data));
      } else {
        ErrorStatus(resp, dispatch);
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  return {
    certificationList,
    getCertificationList,
    certificationUser,
    getCertificationUser,
  };
};
