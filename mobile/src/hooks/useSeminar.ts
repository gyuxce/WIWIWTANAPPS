import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import type { QueryType } from "types/QueryTypes";
import { apiGetSeminar, apiGetSeminarList } from "services/SeminarServices";
import { onGetSeminar, onGetSeminarDetail } from "stores/seminar/seminarSlice";
import { ErrorStatus } from "utils/ErrorStatus";
import type { SeminarType } from "types/SeminarTypes";

export const useSeminar = () => {
  const dispatch = useDispatch();

  const { metaSeminar, seminarDetail, seminarList } = useSelector(
    (state: StoreStateType) => state.seminar,
  );

  const getSeminarList = async (data: SeminarType[], param?: QueryType) => {
    try {
      const resp = await apiGetSeminarList(param);
      const joinData = [...data, ...resp.data];
      if (resp?.data) {
        dispatch(onGetSeminar({ data: joinData, meta: resp?.meta }));
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

  const getSeminarDetail = async (id: string) => {
    try {
      const resp = await apiGetSeminar(id);

      if (resp?.data) {
        dispatch(onGetSeminarDetail(resp?.data));
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
    getSeminarList,
    metaSeminar,
    seminarList,
    seminarDetail,
    getSeminarDetail,
  };
};
