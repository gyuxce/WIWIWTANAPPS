import { createSlice } from "@reduxjs/toolkit";
import type { ConstantType } from "types/ConstantTypes";

export type ConstantState = {
  bloodType: ConstantType[];
  lastEducation: ConstantType[];
  registerInformation: ConstantType[];
  trainingProgram: ConstantType[];
  forumTopicType: ConstantType[];
  forumReportType: ConstantType[];
  forumReportStatus: ConstantType[];
};

export const constantSlice = createSlice({
  name: "constant",
  initialState: {
    bloodType: [] as ConstantType[],
    lastEducation: [] as ConstantType[],
    registerInformation: [] as ConstantType[],
    trainingProgram: [] as ConstantType[],
    forumTopicType: [] as ConstantType[],
    forumReportType: [] as ConstantType[],
    forumReportStatus: [] as ConstantType[],
  } as ConstantState,
  reducers: {
    onGetBloodType: (state, action: { payload: ConstantType[] }) => {
      state.bloodType = action.payload;
    },
    onGetLastEducation: (state, action: { payload: ConstantType[] }) => {
      state.lastEducation = action.payload;
    },
    onGetRegisterInformation: (state, action: { payload: ConstantType[] }) => {
      state.registerInformation = action.payload;
    },
    onGetTrainingProgram: (state, action: { payload: ConstantType[] }) => {
      state.trainingProgram = action.payload;
    },
    onGetForumTopicType: (state, action: { payload: ConstantType[] }) => {
      state.forumTopicType = action.payload;
    },
    onGetForumReportType: (state, action: { payload: ConstantType[] }) => {
      state.forumReportType = action.payload;
    },
    onGetForumReportStatus: (state, action: { payload: ConstantType[] }) => {
      state.forumReportStatus = action.payload;
    },
  },
});

export const {
  onGetBloodType,
  onGetLastEducation,
  onGetRegisterInformation,
  onGetTrainingProgram,
  onGetForumTopicType,
  onGetForumReportStatus,
  onGetForumReportType,
} = constantSlice.actions;

export default constantSlice.reducer;
