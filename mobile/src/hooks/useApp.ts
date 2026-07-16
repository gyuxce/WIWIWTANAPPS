import { useDispatch, useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import { onChangeRoute } from "stores/app/appSlice";

export const useApp = () => {
  const dispatch = useDispatch();
  const { routeName } = useSelector((state: StoreStateType) => state.app);
  const setRouteName = async (route: string) => {
    dispatch(onChangeRoute(route));
  };

  return {
    setRouteName,
    routeName,
  };
};
