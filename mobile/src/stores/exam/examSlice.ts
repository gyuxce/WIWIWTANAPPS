import { createSlice } from "@reduxjs/toolkit";
import type {
  ExamProgressType,
  ExamScheduleType,
  TraningModuleProgressType,
  ModuleDetail,
} from "types/ExamTypes";

export type ExamState = {
  examProgress: ExamProgressType[];
  examSchedule: ExamScheduleType;
  trainingModuleProgress: TraningModuleProgressType[];
  moduleDetail: ModuleDetail[];
  lessonClass: any[];
  lessonClassByDate: any[];
};

export const examSlice = createSlice({
  name: "exam",
  initialState: {
    examProgress: [] as ExamProgressType[],
    examSchedule: {} as ExamScheduleType,
    trainingModuleProgress: [] as TraningModuleProgressType[],
    moduleDetail: [] as ModuleDetail[],
    lessonClass: [] as any,
    lessonClassByDate: [] as any[],
  } as ExamState,
  reducers: {
    onGetExamProgress: (state, action: { payload: ExamProgressType[] }) => {
      state.examProgress = action.payload;
    },
    onGetExamSchedule: (state, action: { payload: ExamScheduleType }) => {
      state.examSchedule = action.payload;
    },
    onGetTrainingModuleProgress: (
      state,
      action: { payload: TraningModuleProgressType[] },
    ) => {
      state.trainingModuleProgress = action.payload;
    },
    onGetLessonClass: (state, action: { payload: any[] }) => {
      state.lessonClass = action.payload;
    },
    onModuleDetail: (state, action: { payload: ModuleDetail[] }) => {
      state.moduleDetail = action.payload;
    },
    onGetLessonClassByDate: (state, action: { payload: any[] }) => {
      state.lessonClassByDate = action.payload;
    },
  },
});

export const {
  onGetExamProgress,
  onGetExamSchedule,
  onGetTrainingModuleProgress,
  onGetLessonClass,
  onGetLessonClassByDate,
  onModuleDetail,
} = examSlice.actions;

export default examSlice.reducer;
