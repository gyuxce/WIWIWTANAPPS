import type { QueryType } from "types/QueryTypes";
import {
  apiCheckPaymentDocs,
  apiGetDetailPrices,
  apiGetPaymentContent,
  apiGetPaymentDetail,
  apiGetPrices,
  apiGetStatusPaymentType,
  apiPostPayment,
  apiInitiateTransaction,
  apiPostPaymentProof,
  apiPgPaymentMethod,
  apiPayTransaction,
  apiGetLatestPayment,
  apiGetLatestTransaction,
  apiConfirmPayment,
} from "services/PaymentServices";
import { useSelector, useDispatch } from "react-redux";
import type { StoreStateType } from "stores";
import {
  onGetDetailPrice,
  onGetPaymentContent,
  onGetPaymentDocStatus,
  onGetStatusPaymentType,
  onInitiateTransaction,
  onLatestPayment,
} from "stores/payment/paymentSlice";
import { ErrorStatus } from "utils/ErrorStatus";

import { useAuth } from "./useAuth";

type ResponseTemplate = {
  status: "success" | "failed";
  data?: any | null;
  message?: unknown;
};

export const usePayment = () => {
  const { auth } = useAuth();
  const {
    detailPrice,
    paymentStatusType,
    paymentContent,
    paymentDocStatus,
    transaction,
    paymentLatest,
  } = useSelector((state: StoreStateType) => state.payment);
  const dispatch = useDispatch();

  const getPrice = async (param?: QueryType) => {
    try {
      const resp: any = await apiGetPrices(param);
      return {
        status: "success",
        message: "",
        data: resp?.data,
      } as ResponseTemplate;
    } catch (errors) {
      ErrorStatus(400, dispatch);
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getDetailPrice = async (type: number, param?: QueryType) => {
    try {
      const resp: any = await apiGetDetailPrices(
        auth?.accessToken,
        type,
        param,
      );
      if (!resp?.data) {
        ErrorStatus(400, dispatch);
        return;
      }
      if (type === 1) {
        dispatch(
          onGetDetailPrice({
            ...detailPrice,
            administration: resp?.data?.amount,
          }),
        );
      }
      if (type === 2) {
        dispatch(
          onGetDetailPrice({
            ...detailPrice,
            training: resp?.data?.amount,
            file_training: resp?.data?.trainingLetter,
            file_installment: resp?.data?.installmentLetter,
          }),
        );
      }
      return {
        status: "success",
        message: "",
        data: resp?.data,
      };
    } catch (errors) {
      ErrorStatus(400, dispatch);
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getPaymentDetail = async (param?: {
    payment_type: number;
    price_type: number;
    relations?: any;
  }) => {
    try {
      const resp: any = await apiGetPaymentDetail(auth?.accessToken, param);
      if (!resp?.data) {
        return {
          status: "failed",
        };
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

  const getPaymentStatusType = async () => {
    try {
      const resp: any = await apiGetStatusPaymentType(auth?.accessToken);
      let data = {
        administration_payment_type: 0,
        administration_payment_type_label: "",
        administration_payment_xendit_link: "",
        administration_payment_xendit_status: null,
        administration_payment_due_date: null,
        is_administration_payment_completed: false,
        training_payment_type: 0,
        training_payment_type_label: "",
        training_payment_xendit_link: "",
        training_payment_xendit_status: null,
        training_payment_due_date: null,
        is_training_payment_completed: false,
      };
      if (resp?.data) {
        data = resp?.data;
      }
      dispatch(onGetStatusPaymentType(data));
      return {
        status: "success",
        message: "",
        data,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const initiateTransaction = async (body: any) => {
    try {
      const resp: any = await apiInitiateTransaction(auth?.accessToken, body);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      if (resp?.status === "success") {
        dispatch(onInitiateTransaction(resp?.data));
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const confirmPayment = async (body: any) => {
    try {
      const resp: any = await apiConfirmPayment(auth?.accessToken, body);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      if (resp?.status === "success") {
        dispatch(onLatestPayment(resp?.data));
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const payTransaction = async (body: any) => {
    try {
      const resp: any = await apiPayTransaction(auth?.accessToken, body);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      if (resp?.status === "success") {
        dispatch(onLatestPayment(resp?.data));
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getLatestTransaction = async (param: { price_type: number }) => {
    try {
      const resp: any = await apiGetLatestTransaction(auth?.accessToken, param);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      if (resp?.status === "success") {
        dispatch(onInitiateTransaction(resp?.data));
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getLatestPayment = async (param: {
    price_type: number;
  }): Promise<ResponseTemplate> => {
    try {
      const resp: any = await apiGetLatestPayment(auth?.accessToken, param);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      if (resp?.status === "success") {
        dispatch(onLatestPayment(resp?.data));
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postPayment = async (body: any) => {
    try {
      const resp: any = await apiPostPayment(auth?.accessToken, body);
      if (resp?.status !== "success") {
        return {
          status: "failed",
          message: "",
        };
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const postPaymentProof = async (body: any) => {
    try {
      const resp: any = await apiPostPaymentProof(auth?.accessToken, body);
      if (!resp?.data) {
        return {
          status: "failed",
          message: "",
        };
      }
      return {
        status: "success",
        data: resp?.data,
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getPaymentContent = async (param: {
    payment_type?: number;
    price_type: number;
    language_type: number;
  }) => {
    try {
      const resp: any = await apiGetPaymentContent(auth?.accessToken, param);
      if (resp?.status === "success") {
        dispatch(onGetPaymentContent(resp?.data));
      }
      return {
        status: resp?.status,
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

  const checkPaymentDoc = async () => {
    try {
      const resp: any = await apiCheckPaymentDocs(auth?.accessToken);
      if (resp?.data) {
        dispatch(onGetPaymentDocStatus(resp?.data));
      }
      return {
        status: resp?.status,
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

  const getPaymentMethods = async () => {
    try {
      const resp: any = await apiPgPaymentMethod(auth?.accessToken);
      if (!resp?.data) {
        return {
          status: "failed",
        };
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
    getDetailPrice,
    postPayment,
    getPaymentDetail,
    detailPrice,
    paymentStatusType,
    getPaymentStatusType,
    postPaymentProof,
    getPaymentContent,
    paymentContent,
    checkPaymentDoc,
    paymentDocStatus,
    getPrice,
    getPaymentMethods,
    initiateTransaction,
    payTransaction,
    getLatestPayment,
    transaction,
    paymentLatest,
    getLatestTransaction,
    confirmPayment,
  };
};
