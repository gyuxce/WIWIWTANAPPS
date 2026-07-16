import { createSlice } from "@reduxjs/toolkit";

export type AppState = {
  routeName: string;
};

export const appSlice = createSlice({
  name: "app",
  initialState: {
    routeName: "HomeScreen",
  } as AppState,
  reducers: {
    onChangeRoute: (state, action: { payload: string }) => {
      state.routeName = action.payload;
    },
  },
});

export const { onChangeRoute } = appSlice.actions;

export default appSlice.reducer;
