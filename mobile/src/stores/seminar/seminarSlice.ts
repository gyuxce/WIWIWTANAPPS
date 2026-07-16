import { createSlice } from "@reduxjs/toolkit";
import type { MetaTypes } from "types/MetaTypes";
import type { SeminarType } from "types/SeminarTypes";

export type SeminarState = {
  seminarList: SeminarType[];
  metaSeminar: MetaTypes;
  seminarDetail: SeminarType;
};

export const seminarSlice = createSlice({
  name: "seminar",
  initialState: {
    seminarList: [] as SeminarType[],
    metaSeminar: {} as MetaTypes,
    seminarDetail: {} as SeminarType,
  } as SeminarState,
  reducers: {
    onGetSeminar: (
      state,
      action: { payload: { data: SeminarType[]; meta: MetaTypes } },
    ) => {
      state.metaSeminar = action.payload.meta;
      state.seminarList = action.payload.data;
    },
    onGetSeminarDetail: (state, action: { payload: SeminarType }) => {
      state.seminarDetail = action.payload;
    },
  },
});

export const { onGetSeminar, onGetSeminarDetail } = seminarSlice.actions;

export default seminarSlice.reducer;
