import type { QueryType } from "types/QueryTypes";
import { convertToQuery } from "utils/Utils";
import type { SeminarType } from "types/SeminarTypes";
import type { MetaTypes } from "types/MetaTypes";

import BaseService from "./BaseService";

export const apiGetSeminarList = (param?: QueryType) => {
  return BaseService(
    "/public/master/seminar?" + convertToQuery(param),
  ).get() as Promise<{ data: SeminarType[]; meta: MetaTypes }>;
};

export const apiGetSeminar = (id: string) => {
  return BaseService(
    "/public/master/seminar/" + id + "?relations=cover",
  ).get() as Promise<{ data: SeminarType }>;
};
