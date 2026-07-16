import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import {
  onGetLanguageTest,
  onNewInstall,
  onScreenUsage,
  onWrongAttemptPassword,
} from "stores/persist/persistSlice";
import { useAuth } from "./useAuth";
import { apiExamQuestion } from "services/ExamServices";
import { ErrorStatus } from "utils/ErrorStatus";

export const usePersist = () => {
  const dispatch = useDispatch();
  const {
    isNewInstall,
    wrongAttemptPassword,
    tesBahasa,
    sessionTestBahasa,
    screenUsage,
    language,
    pratestMedia,
  } = useSelector((state: StoreStateType) => state.persist);
  const { auth } = useAuth();

  const changeInstall = (install: boolean) => {
    dispatch(onNewInstall(install));
  };

  const attemptPassword = (
    attempt: number,
    lastTime: number,
    loginTry: number,
  ) => {
    dispatch(
      onWrongAttemptPassword({
        wrongAttemptPassword: { attempt, lastTime, loginTry },
      }),
    );
  };

  const getTestBahasa = async (sessionId: string) => {
    try {
      const resp = await apiExamQuestion(auth?.accessToken, sessionId);
      if (resp?.data) {
        dispatch(onGetLanguageTest(resp?.data));
      } else {
        ErrorStatus(500, dispatch);
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

  const addScreenUsage = async (timer: number) => {
    dispatch(onScreenUsage(timer));
  };
  return {
    changeInstall,
    isNewInstall,
    attemptPassword,
    wrongAttemptPassword,
    getTestBahasa,
    tesBahasa,
    sessionTestBahasa,
    screenUsage,
    addScreenUsage,
    language,
    pratestMedia,
  };
};
