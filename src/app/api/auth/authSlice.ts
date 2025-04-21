import type { RootState } from 'src/app/store';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  fullName: string;
  email: string
  role: string;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken?: string; refreshToken?: string }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) {
        state.accessToken = accessToken;
      }

      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export default authSlice.reducer;

export const { setCredentials, setUser, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectCurrentUserRole = (state: RootState) => state.auth.user?.role;

export const selectCurrentAccessToken = (state: RootState) => state.auth.accessToken;

export const selectCurrentRefreshToken = (state: RootState) => state.auth.refreshToken;
