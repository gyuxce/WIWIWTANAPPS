import { QueryType } from "types/QueryTypes";
import BaseService from "./BaseService";
import {
  CertificationListType,
  CertificationUserType,
} from "types/CertificationTypes";
import { convertToQuery } from "utils/Utils";

export const apiCertificationList = (token: string, param: QueryType) => {
  return BaseService(
    `/mobile/master/certifications?` + convertToQuery(param),
    token,
  )
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{ data: CertificationListType[] }>;
};

export const apiCertificationUser = (token: string, param: QueryType) => {
  return BaseService(
    `/mobile/master/certification-students?` + convertToQuery(param),
    token,
  )
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{ data: CertificationUserType[] }>;
};

export const apiPostCertification = (
  token: string,
  body: {
    name: string;
    user_id: string;
    certification_id: string;
    location: string;
    cert_date: string;
    cert_file_id: string;
  },
) => {
  return (
    BaseService(`/mobile/master/certification-students`, token)
      .headers({
        Authorization: "Bearer " + token,
      })
      //.json(body)
      .post(body)
  );
};
