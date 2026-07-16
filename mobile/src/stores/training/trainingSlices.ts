import { createSlice } from "@reduxjs/toolkit";
import {
  AssesmentTypeResponse,
  MaterialContentType,
  VirtualClassModuleType,
} from "types/TrainingTypes";

export type TrainingState = {
  virtualClassList: VirtualClassModuleType[];
  virtualClassNoFilter: VirtualClassModuleType[];
  assesmentList: AssesmentTypeResponse[];
  assesmentListNoFilter: AssesmentTypeResponse[];
  materiDetail: MaterialContentType[];
  assesmentDetail: AssesmentTypeResponse;
};

export const trainingSlice = createSlice({
  name: "training",
  initialState: {
    virtualClassList: [] as VirtualClassModuleType[],
    virtualClassNoFilter: [] as VirtualClassModuleType[],
    materiDetail: [] as MaterialContentType[],
    assesmentDetail: {} as AssesmentTypeResponse,
  } as TrainingState,
  reducers: {
    onGetVirtualClassList: (
      state,
      action: { payload: VirtualClassModuleType[] },
    ) => {
      state.virtualClassList = action.payload;
    },
    onGetVirtualClassNoFilter: (
      state,
      action: { payload: VirtualClassModuleType[] },
    ) => {
      state.virtualClassNoFilter = action.payload;
    },
    onGetAssesment: (state, action: { payload: AssesmentTypeResponse[] }) => {
      state.assesmentList = action.payload;
    },
    onGetAssesmentNoFilter: (
      state,
      action: { payload: AssesmentTypeResponse[] },
    ) => {
      state.assesmentListNoFilter = action.payload;
    },
    onGetMaterialContent: (
      state,
      action: { payload: MaterialContentType[] },
    ) => {
      state.materiDetail = action.payload;
    },
    onGetAssesmentDetail: (
      state,
      action: { payload: AssesmentTypeResponse },
    ) => {
      state.assesmentDetail = action.payload;
    },
  },
});

export const {
  onGetVirtualClassList,
  onGetVirtualClassNoFilter,
  onGetAssesment,
  onGetAssesmentNoFilter,
  onGetMaterialContent,
  onGetAssesmentDetail,
} = trainingSlice.actions;

export default trainingSlice.reducer;
