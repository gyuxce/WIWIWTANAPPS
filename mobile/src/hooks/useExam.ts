import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import {
  apiExamProgress,
  apiExamSchedule,
  apiGetLessonClass,
  apiTrainingModuleProgress,
  apiModuleDetail,
} from "services/ExamServices";
import {
  onGetExamProgress,
  onGetExamSchedule,
  onGetLessonClass,
  onGetLessonClassByDate,
  onGetTrainingModuleProgress,
} from "stores/exam/examSlice";
import { ErrorStatus } from "utils/ErrorStatus";
import type { StatusTestType } from "types/UserTypes";
import type { ExamProgressType } from "types/ExamTypes";

import { useAuth } from "./useAuth";

type ModuleContentProgress = {
  title: string;
  title_japan?: string;
  id: string;
  isOpen: boolean;
  total: number;
  total_finished: number;
};

type ModuleGroupProgress = {
  title: string;
  title_japan?: string;
  total: number;
  total_finished: number;
  content: ModuleContentProgress[];
};

type ModuleLevelProgress = {
  level_module: number;
  title: string;
  isOpen: boolean;
  total: number;
  total_finished: number;
  level_module_label: string;
  child: ModuleGroupProgress[];
};

export const useExam = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const {
    examProgress,
    examSchedule,
    trainingModuleProgress,
    lessonClass,
    lessonClassByDate,
  } = useSelector((state: StoreStateType) => state.exam);
  const getExamProgress = async () => {
    try {
      const resp = await apiExamProgress(auth?.accessToken);
      if (resp?.data) {
        dispatch(onGetExamProgress(resp?.data));
      } else {
        ErrorStatus(500, dispatch);
      }

      return {
        data: resp?.data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getExamSchedule = async (sessionId: string) => {
    try {
      const resp = await apiExamSchedule(auth?.accessToken, sessionId);
      if (resp?.data) {
        dispatch(onGetExamSchedule(resp?.data));
      } else {
        ErrorStatus(500, dispatch);
      }

      return {
        data: resp?.data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const checkExamProgress = (
    dataExam: ExamProgressType[],
    itemTest: StatusTestType,
  ) => {
    const exam = dataExam?.find(
      (item: ExamProgressType) => item?.progress?.title === itemTest?.slug,
    );

    if (!exam || exam?.status !== 1) {
      return false;
    }
    return true;
  };

  const getTrainingModuleProgress = async () => {
    try {
      const resp = await apiTrainingModuleProgress(auth?.accessToken);
      if (resp?.data) {
        dispatch(onGetTrainingModuleProgress(resp?.data));
      } else {
        ErrorStatus(500, dispatch);
      }

      return {
        data: resp?.data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getLessonClass = async (param?: any, isCalendar = false) => {
    try {
      const resp = await apiGetLessonClass(auth?.accessToken, param);

      if (resp?.data) {
        let data = resp?.data;
        if (isCalendar) {
          data = data?.map(item => ({
            ...item,
            date: item?.event?.started_at || "-",
            title: item?.event?.title,
            headerTitle: item?.module?.title_japan || item?.module?.title,
            type: item?.course?.type_label,
            image: item?.event?.cover?.url,
            numberEvent: item?.module?.level_module_label,
            link: item?.event?.external_url || "-",
            description: item?.event?.description || "-",
          }));

          dispatch(onGetLessonClass(data));
        }
      }

      return {
        data: resp?.data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getLessonClassByDate = async (param?: any) => {
    try {
      const resp = await apiGetLessonClass(auth?.accessToken, param);
      if (resp?.data) {
        let data = resp?.data;

        data = data?.map(item => ({
          ...item,
          date: item?.event?.started_at,
          title: item?.event?.title,
          headerTitle: item?.module?.title_japan || item?.module?.title,
          type: item?.course?.type_label,
          image: item?.event?.cover?.url,
          numberEvent: item?.module?.level_module_label,
          link: item?.event?.external_url || "-",
          description: item?.event?.description || "-",
        }));

        dispatch(onGetLessonClassByDate(data));
      }

      return {
        data: resp?.data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getModuleDetail = async (param?: any) => {
    try {
      let new_data: ModuleLevelProgress[] = [];
      const resp = (await apiModuleDetail(auth?.accessToken, param)) as {
        data?: any[];
      };
      if (resp?.data) {
        let data = resp?.data;
        data.forEach((element: any) => {
          let cek_level = new_data.find(
            x => x.level_module == element.level_module,
          );
          let content = element.content.map((content: any) => {
            let cont = {
              title: content.title,
              title_japan: content.title_japan,
              id: content.id,
              isOpen: false,
              total: content.materialContent.length,
              total_finished: content.materialContent.filter(
                (x: any) => x.progress && x.progress.status == 1,
              ).length,
            };

            return cont;
          });
          let child: ModuleGroupProgress = {
            title: element.title,
            title_japan: element.title_japan,
            total: content.length,
            total_finished: content.filter(
              (x: ModuleContentProgress) =>
                x.total == x.total_finished && x.total != 0,
            ).length,
            content: [...content],
          };
          if (cek_level) {
            let indexLevel = new_data.findIndex(
              x => x.level_module == element.level_module,
            );

            const levelItem = new_data[indexLevel];
            if (levelItem) {
              levelItem.child.push(child);
            }
          } else {
            new_data.push({
              level_module: element.level_module,
              title: "Level " + element.level_module_label,
              isOpen: false,
              total: 0,
              total_finished: 0,
              level_module_label: element.level_module_label,
              child: [child],
            });
          }
        });
        new_data = new_data.map(x => {
          let mapping = { ...x };
          mapping.total = x.child.length;
          mapping.total_finished = x.child.filter(
            (x: ModuleGroupProgress) =>
              x.total == x.total_finished && x.total != 0,
          ).length;
          return mapping;
        });
        // dispatch(onModuleDetail(data));
      }

      return {
        data: new_data,
        status: "success",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  return {
    getExamProgress,
    examProgress,
    getExamSchedule,
    examSchedule,
    checkExamProgress,
    getTrainingModuleProgress,
    trainingModuleProgress,
    getLessonClass,
    lessonClass,
    lessonClassByDate,
    getLessonClassByDate,
    getModuleDetail,
  };
};
