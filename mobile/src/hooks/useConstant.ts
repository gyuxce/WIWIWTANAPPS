import { useDispatch, useSelector } from "react-redux";
import { apiConstant } from "services/UserService";
import type { StoreStateType } from "stores";
import {
  onGetBloodType,
  onGetForumReportStatus,
  onGetForumReportType,
  onGetForumTopicType,
  onGetLastEducation,
  onGetRegisterInformation,
  onGetTrainingProgram,
} from "stores/constant/constantSlice";
import { onChangeLanguage } from "stores/persist/persistSlice";
import { useTranslation } from "react-i18next";

export const useConstant = () => {
  const dispatch = useDispatch();
  const {
    bloodType,
    registerInformation,
    lastEducation,
    trainingProgram,
    forumTopicType,
    forumReportStatus,
    forumReportType,
  } = useSelector((state: StoreStateType) => state.constant);
  const { i18n } = useTranslation();

  const getBloodData = async () => {
    try {
      const resp: any = await apiConstant("blood_type");

      if (resp) {
        dispatch(onGetBloodType(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };
  const getRegisterInformationData = async () => {
    try {
      const resp: any = await apiConstant("register_information");

      if (resp) {
        dispatch(onGetRegisterInformation(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getLastEducationData = async () => {
    try {
      const resp: any = await apiConstant("last_education");

      if (resp) {
        dispatch(onGetLastEducation(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getTrainingProgram = async () => {
    try {
      const resp: any = await apiConstant("training_program");

      if (resp) {
        dispatch(onGetTrainingProgram(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getForumTopicType = async () => {
    try {
      const resp: any = await apiConstant("forum_topic_type");

      if (resp) {
        dispatch(onGetForumTopicType(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getForumReportType = async () => {
    try {
      const resp: any = await apiConstant("forum_report_type");

      if (resp) {
        dispatch(onGetForumReportType(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getForumReportStatus = async () => {
    try {
      const resp: any = await apiConstant("forum_report_status");

      if (resp) {
        dispatch(onGetForumReportStatus(resp));
      }
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  const getSettingAdmin = async () => {
    try {
      // The current production release is Indonesian-only. This hook may run
      // after token restore, so enforce the same language as the login flow.
      dispatch(onChangeLanguage("id"));
      i18n.changeLanguage("id");

      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors,
      };
    }
  };

  return {
    bloodType,
    registerInformation,
    lastEducation,
    trainingProgram,
    forumTopicType,
    forumReportStatus,
    forumReportType,
    getBloodData,
    getLastEducationData,
    getRegisterInformationData,
    getTrainingProgram,
    getForumTopicType,
    getForumReportStatus,
    getForumReportType,
    getSettingAdmin,
  };
};
