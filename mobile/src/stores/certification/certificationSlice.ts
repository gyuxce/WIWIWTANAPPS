import { createSlice } from "@reduxjs/toolkit";
import {
  CertificationListType,
  CertificationUserType,
} from "types/CertificationTypes";

export type CertificationState = {
  certificationList: CertificationListType[];
  certificationUser: CertificationUserType[];
};

export const certificationSlice = createSlice({
  name: "certification",
  initialState: {
    certificationList: [] as CertificationListType[],
    certificationUser: [] as CertificationUserType[],
  } as CertificationState,
  reducers: {
    onGetCertificationList: (
      state,
      action: { payload: CertificationListType[] },
    ) => {
      state.certificationList = action.payload;
    },
    onGetCertificationUser: (
      state,
      action: { payload: CertificationUserType[] },
    ) => {
      state.certificationUser = action.payload;
    },
  },
});

export const { onGetCertificationList, onGetCertificationUser } =
  certificationSlice.actions;

export default certificationSlice.reducer;
