import { useDispatch, useSelector } from "react-redux";
import { StoreStateType } from "stores";
import { useAuth } from "./useAuth";
import {
  apiMaterialDetail,
  apiModuleAssesment,
  apiModuleVirtualClass,
} from "services/ExamServices";
import {
  onGetAssesment,
  onGetAssesmentDetail,
  onGetAssesmentNoFilter,
  onGetMaterialContent,
  onGetVirtualClassList,
  onGetVirtualClassNoFilter,
} from "stores/training/trainingSlices";
import { ErrorStatus } from "utils/ErrorStatus";
import { QueryType } from "types/QueryTypes";
import {
  AssesmentTypeResponse,
  MaterialContentType,
} from "types/TrainingTypes";
import dayjs from "dayjs";

export const useTraining = () => {
  const dispatch = useDispatch();

  const {
    virtualClassList,
    virtualClassNoFilter,
    assesmentList,
    assesmentListNoFilter,
    materiDetail,
    assesmentDetail,
  } = useSelector((state: StoreStateType) => state.training);
  const { auth } = useAuth();

  const getVirtualClassList = async (
    category_id: string,
    event_name?: string,
    start_date?: string,
    end_date?: string,
    selectedFilter?: { id: string; title: string }[],
    selectedSort?: { id: string; title: string },
  ) => {
    try {
      const resp = await apiModuleVirtualClass(
        auth?.accessToken,
        category_id,
        event_name,
        start_date,
        end_date,
      );

      if (resp?.data) {
        let data = resp?.data;
        if (selectedFilter?.length === 2 || selectedFilter?.length === 0) {
          data = resp?.data;
        } else {
          data = data.map(item => {
            const newItem = { ...item };
            if (newItem.classVirtual) {
              newItem.classVirtual = newItem.classVirtual.filter(cvItem => {
                //@ts-ignore
                if (selectedFilter[0]?.id === "1") {
                  return dayjs(cvItem?.event?.started_at).isAfter(new Date());
                } else {
                  return dayjs(cvItem?.event?.started_at).isBefore(new Date());
                }
              });
            }

            return newItem; // Return the modified item
          });
        }
        if (selectedSort?.id) {
          data = data.map(item => {
            // Create a shallow copy of the item to avoid mutating the original object
            const newItem = { ...item };

            if (newItem.classVirtual) {
              // Sort classVirtual based on selectedSort.id
              newItem.classVirtual.sort((c, d) => {
                if (selectedSort.id === "date-asc") {
                  return (
                    new Date(c.event?.started_at).getTime() -
                    new Date(d.event?.started_at).getTime()
                  );
                } else {
                  return (
                    new Date(d.event?.started_at).getTime() -
                    new Date(c.event?.started_at).getTime()
                  );
                }
              });
            }

            return newItem;
          });

          data = data.sort((a, b) => {
            if (selectedSort.id === "asc") {
              return b.level_module - a.level_module;
            } else if (selectedSort.id === "desc") {
              return a.level_module - b.level_module;
            } else {
              return 0;
            }
          });
        }
        dispatch(onGetVirtualClassList(data));
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
  const getVirtualClassNoFilter = async (
    category_id: string,
    event_name?: string,
    start_date?: string,
    end_date?: string,
  ) => {
    try {
      const resp = await apiModuleVirtualClass(
        auth?.accessToken,
        category_id,
        event_name,
        start_date,
        end_date,
      );

      if (resp?.data) {
        dispatch(onGetVirtualClassNoFilter(resp?.data));
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

  const getAssesmentList = async (
    category_id: string,
    start_date?: string,
    end_date?: string,
    start_weight?: string,
    end_weight?: string,
  ) => {
    try {
      const resp = await apiModuleAssesment(
        auth?.accessToken,
        category_id,
        start_date,
        end_date,
        start_weight,
        end_weight,
      );

      if (resp?.data) {
        dispatch(onGetAssesment(resp?.data));
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

  const getAssesmentListNoFilter = async (
    category_id: string,
    start_date?: string,
    end_date?: string,
  ) => {
    try {
      const resp = await apiModuleAssesment(
        auth?.accessToken,
        category_id,
        start_date,
        end_date,
      );

      if (resp?.data) {
        dispatch(onGetAssesmentNoFilter(resp?.data));
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

  const getMateriDetail = async (param?: QueryType) => {
    try {
      const resp = await apiMaterialDetail(auth?.accessToken, param);

      if (resp?.data) {
        dispatch(
          onGetMaterialContent(
            resp?.data?.[0]?.materialContent || ([] as MaterialContentType[]),
          ),
        );
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

  const getAssesmentDetail = async (param?: QueryType) => {
    try {
      const resp = await apiMaterialDetail(auth?.accessToken, param);

      if (resp?.data) {
        dispatch(
          onGetAssesmentDetail(resp?.data || ({} as AssesmentTypeResponse)),
        );
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
    getVirtualClassList,
    virtualClassList,
    virtualClassNoFilter,
    getVirtualClassNoFilter,
    assesmentList,
    assesmentListNoFilter,
    getAssesmentList,
    getAssesmentListNoFilter,
    getMateriDetail,
    materiDetail,
    assesmentDetail,
    getAssesmentDetail,
  };
};
