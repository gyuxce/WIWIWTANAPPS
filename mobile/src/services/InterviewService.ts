import { InterviewTypeList } from "types/InterviewTypes";
import BaseService from "./BaseService";

export const apiInterviewService = (token: string) => {
  return BaseService(`/mobile/training/final-interview`, token)
    .headers({
      Authorization: "Bearer " + token,
    })
    .get() as Promise<{ data: { interviews: InterviewTypeList[] } }>;
};
