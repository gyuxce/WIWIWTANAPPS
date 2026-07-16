import icons from "configs/icons";
import { onErrorState } from "stores/error/errorSlice";
import { onLogin } from "stores/persist/persistSlice";
import { AuthType, UserType } from "types/UserTypes";
import NavigationService from "./NavigationService";
import { wait } from "./Utils";
import { resetAllState } from "stores";

export const ErrorStatus = (status: any, dispatch: any) => {
  dispatch(
    onErrorState({
      visible: false,
      text: "",
      icon: icons.searchClose,
      withCloseIcon: true,
      withIcon: true,
    }),
  );
  let text = "";
  if (status === 400) {
    text = "Error fetching data from server";
  } else if (status === 403) {
    text = "Error forbidden from server";
  } else if (status === 400) {
    text = "Error bad request from server";
  } else if (status === 500) {
    text = "Error internal server";
  } else if (status === 502) {
    text = "Error bad gateway";
  } else if (status === 401) {
    text = "Unauthorized error, please login again";
    dispatch(onLogin({ auth: {} as AuthType, user: {} as UserType }));
    dispatch(resetAllState());
    wait(500).then(() => {
      NavigationService.navigateResetGuest();
    });

    //NavigationService.navigate("GuestScreen");
  } else {
    text = "Error not known";
  }
  dispatch(
    onErrorState({
      visible: true,
      text: text,
      icon: icons.searchClose,
      withCloseIcon: true,
      withIcon: true,
    }),
  );
};
