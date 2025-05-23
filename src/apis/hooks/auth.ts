import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { auth } from '../services/auth';

export const useLogin = (): UseMutationResult<Types.LoginResponse, Error, Types.LoginRequest> =>
  useMutation({
    mutationFn: auth.login,
  });

export const useRefreshToken = (): UseMutationResult<Types.TokenRefreshResponse, Error, Types.TokenRefreshRequest> =>
  useMutation({
    mutationFn: auth.refreshToken,
  });

export const useForgotPassword = (): UseMutationResult<Types.StringResponse, Error, Types.ForgotPasswordRequest> =>
  useMutation({
    mutationFn: auth.forgotPassword,
  });

export const useResetPassword = (): UseMutationResult<Types.StringResponse, Error, Types.ResetPasswordRequest> =>
  useMutation({
    mutationFn: auth.resetPassword,
  });

export const useChangePassword = (): UseMutationResult<Types.StringResponse, Error, Types.ChangePasswordRequest> =>
  useMutation({
    mutationFn: auth.changePassword,
  });

export const useVerifyResetToken = (token: string, options?: { enabled?: boolean }): UseQueryResult<boolean, Error> =>
  useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: () => auth.verifyResetToken(token),
    enabled: options?.enabled ?? !!token,
  });
