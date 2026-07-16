import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
  name: 'auth/session',
  initialState: {
    access_token: '',
    refresh_token: '',
    signedIn: false,
    access_token_expires_at: '',
    refresh_token_expires_at: '',
    session_id: '',
  },
  reducers: {
    onSignInSuccess: (state, action) => {
      state.signedIn = true;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.access_token_expires_at = action.payload.access_token_expires_at;
      state.refresh_token_expires_at = action.payload.refresh_token_expires_at;
      state.session_id = action.payload.session_id;
      state.remember_me = action.payload.remember_me;
    },
    onSignInError: (state, action) => {
      state.signedIn = false;
      state.access_token = '';
      state.refresh_token = '';
      state.access_token_expires_at = '';
      state.refresh_token_expires_at = '';
      state.session_id = '';
      state.error = action.payload;
    },
    onSignOutSuccess: (state) => {
      state.signedIn = false;
      state.access_token = '';
      state.refresh_token = '';
      state.access_token_expires_at = '';
      state.refresh_token_expires_at = '';
      state.session_id = '';
    },
    setToken: (state, action) => {
      state.access_token = action.payload.access_token;
    },
    setRefreshToken: (state, action) => {
      state.refresh_token = action.payload.refresh_token;
    },
  },
});

export const { onSignInSuccess, onSignInError, onSignOutSuccess, setToken } = sessionSlice.actions;

export default sessionSlice.reducer;
