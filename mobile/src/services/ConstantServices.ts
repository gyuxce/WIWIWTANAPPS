import { SettingType } from "types/ConstantTypes";
import BaseService from "./BaseService";
import { convertToQuery } from "utils/Utils";
import { QueryType } from "types/QueryTypes";

export const apiGetSettingAdmin = (token: string, param?: QueryType) => {
  return BaseService(
    "/base/settings?" + convertToQuery(param),
    token,
  ).get() as Promise<{ data: SettingType[] }>;
};

export const apiGetPengaturanBahasa = (token: string) => {
  return BaseService(
    `/base/settings?type=collection&options%5B%5D=filter%2Cgroup%2Cequal%2Cpengaturan-bahasa`,
    token,
  ).get() as Promise<{
    data: {
      id: string;
      name: string;
      slug: string;
      value: string;
      group: string;
      description: string;
    }[];
  }>;
};
