import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./useAuth";
import { apiInterviewService } from "services/InterviewService";
import { onGetInterviewList } from "stores/interview/interviewSlice";
import { ErrorStatus } from "utils/ErrorStatus";
import { StoreStateType } from "stores";

export const useInterview = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const { interviewsList } = useSelector(
    (state: StoreStateType) => state.interview,
  );

  const getInterviewList = async () => {
    try {
      const resp = await apiInterviewService(auth?.accessToken);
      if (resp) {
        dispatch(onGetInterviewList(resp?.data?.interviews));
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
    interviewsList,
    getInterviewList,
  };
};
