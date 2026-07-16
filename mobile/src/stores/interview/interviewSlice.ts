import { createSlice } from "@reduxjs/toolkit";
import { InterviewTypeList } from "types/InterviewTypes";

export type InterviewState = {
  interviewsList: InterviewTypeList[];
};

export const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    interviewsList: [] as InterviewTypeList[],
  } as InterviewState,
  reducers: {
    onGetInterviewList: (state, action: { payload: InterviewTypeList[] }) => {
      state.interviewsList = action.payload;
    },
  },
});

export const { onGetInterviewList } = interviewSlice.actions;
export default interviewSlice.reducer;
