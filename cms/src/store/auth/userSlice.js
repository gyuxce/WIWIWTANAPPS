import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  dataUser: {},
  authority: [],
};

export const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.dataUser = action?.payload;
    },
    setAuthority: (state, action) => {
      state.authority = action?.payload;
    },
    userLoggedOut: () => initialState,
  },
});

export const { setUser, setAuthority } = userSlice.actions;

export default userSlice.reducer;
