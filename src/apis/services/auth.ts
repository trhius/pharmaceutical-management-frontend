import * as Types from '../types';
import { apiClient } from '../client';

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const auth = {
  login: (data: Types.LoginRequest): Promise<Types.LoginResponse> =>
    apiClient.post('/api/auth/login', data).then((res) => res.data),

  refreshToken: (data: Types.TokenRefreshRequest): Promise<Types.TokenRefreshResponse> =>
    apiClient.post('/api/auth/refresh-token', data).then((res) => res.data),

  forgotPassword: (data: Types.ForgotPasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/auth/forgot-password', data).then((res) => res.data),

  resetPassword: (data: Types.ResetPasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/auth/reset-password', data).then((res) => res.data),

  changePassword: (data: Types.ChangePasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/account/change-password', data).then((res) => res.data),

  verifyResetToken: (token: string): Promise<boolean> =>
    apiClient.get(`/api/auth/verify-reset-token?token=${token}`).then((res) => res.data),
};
