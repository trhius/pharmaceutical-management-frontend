/**
 * This file contains TypeScript interfaces related to Authentication.
 */

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  userInfo?: UserInfoResponse;
}

export interface UserInfoResponse {
  id?: number;
  email?: string;
  role?: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  name?: string;
  firstTimeLogin?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}
