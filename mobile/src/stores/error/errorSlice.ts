import { createSlice } from "@reduxjs/toolkit";
import type { ImageSourcePropType } from "react-native";

export interface ErrorType {
  visible: boolean;
  text: string;
  withIcon: boolean;
  icon: ImageSourcePropType;
  withCloseIcon: boolean;
}

export type ErrorState = {
  error: ErrorType;
};

export const errorSlice = createSlice({
  name: "error",
  initialState: {
    error: {} as ErrorType,
  },
  reducers: {
    onErrorState: (state, action: { payload: ErrorType }) => {
      state.error = action.payload;
    },
  },
});

export const { onErrorState } = errorSlice.actions;

export default errorSlice.reducer;
