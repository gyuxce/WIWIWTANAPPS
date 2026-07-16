import type { QueryType } from "types/QueryTypes";
import { convertToQuery } from "utils/Utils";

import BaseService from "./BaseService";

export const apiGetPrices = (param?: QueryType) => {
  return BaseService("/mobile/prices?" + convertToQuery(param)).get();
};

export const apiGetDetailPrices = (
  token: string,
  type: number,
  param?: QueryType,
) => {
  return BaseService(
    `/mobile/finance/prices/detail/${type}?` + convertToQuery(param),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get();
};

export const apiGetPaymentDetail = (token: string, param?: any) => {
  return BaseService(
    "/mobile/finance/transactions/detail?" + convertToQuery(param),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get();
};

export const apiGetStatusPaymentType = (token: string) => {
  return BaseService("/mobile/finance/batch-users/detail", token)
    .headers({ Authorization: "Bearer " + token })
    .get();
};

export const apiPostPayment = async (token: string, body: any) => {
  return BaseService("/mobile/finance/transactions", token)
    .headers({ Authorization: `Bearer ${token}` })
    .post(body) as Promise<any>;
};

export const apiInitiateTransaction = async (token: string, body: any) => {
  return BaseService("/mobile/finance/transactions/initiate", token)
    .headers({ Authorization: `Bearer ${token}` })
    .post(body) as Promise<any>;
};

export const apiPayTransaction = async (token: string, body: any) => {
  return BaseService("/mobile/finance/transactions/pay", token)
    .headers({ Authorization: `Bearer ${token}` })
    .post(body) as Promise<any>;
};

export const apiConfirmPayment = async (token: string, body: any) => {
  return BaseService("/mobile/finance/transactions/payment/confirm", token)
    .headers({ Authorization: `Bearer ${token}` })
    .post(body) as Promise<any>;
};

export const apiGetLatestTransaction = async (token: string, param?: any) => {
  let url = "/mobile/finance/transactions/latest?" + convertToQuery(param);
  return BaseService(url, token)
    .headers({ Authorization: `Bearer ${token}` })
    .get();
};

export const apiGetLatestPayment = async (token: string, param?: any) => {
  let url = "/mobile/finance/transactions/payment/latest?" + convertToQuery(param);
  return BaseService(url, token)
    .headers({ Authorization: `Bearer ${token}` })
    .get() as Promise<any>;
};

export const apiPostPaymentProof = async (token: string, body: any) => {
  return BaseService("/mobile/finance/payment-proofs", token)
    .headers({ Authorization: `Bearer ${token}` })
    .post(body) as Promise<any>;
};

export const apiGetPaymentContent = (token: string, param?: any) => {
  return BaseService(
    "/mobile/finance/payment-contents/show?" + convertToQuery(param),
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get();
};

export const apiCheckPaymentDocs = (token: string) => {
  return BaseService(
    "/mobile/base/users/user-files/payment/training-document-check",
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get();
};

export const apiPgPaymentMethod = (token: string) => {
  return BaseService(
    "/pg/pivot/payment-method",
    token,
  )
    .headers({ Authorization: "Bearer " + token })
    .get();
};