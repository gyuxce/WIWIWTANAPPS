import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import type { ErrorType } from "stores/error/errorSlice";
import { onErrorState } from "stores/error/errorSlice";

export const useError = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state: StoreStateType) => state.error);
  const setError = async (err: ErrorType) => {
    dispatch(onErrorState(err));
  };

  return {
    setError,
    error,
  };
};
