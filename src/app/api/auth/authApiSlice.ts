import { API_AUTH } from '../endpoints';
import { apiSlice, noAuthApiSlice } from '../apiSlice';

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_AUTH.login,
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: API_AUTH.register,
        method: 'POST',
        body: { ...payload },
      }),
    }),
    refresh: builder.mutation({
      query: (payload) => ({
        url: API_AUTH.refreshToken,
        method: 'POST',
        body: {
          ...payload,
        },
      }),
    }),
    requestResetPassword: builder.mutation({
      query: (payload) => ({
        url: `/api/auth/forgot-password`,
        method: 'POST',
        body: payload,
      }),
    }),
    verifyResetPasswordToken: builder.mutation({
      query: (token) => ({
        url: `/api/auth/verify-reset-token?token=${token}`,
        method: 'GET',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/api/auth/reset-password`,
        method: 'POST',
        body: { token, newPassword },
      }),
    }),
    removeRefreshToken: builder.mutation({
      query: () => ({
        url: '/users/auth/logout',
        method: 'GET',
      }),
    }),
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (payload) => ({
        url: API_AUTH.changePassword,
        method: 'PATCH',
        body: { ...payload },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useRequestResetPasswordMutation,
  useVerifyResetPasswordTokenMutation,
  useResetPasswordMutation,
  useRemoveRefreshTokenMutation,
} = noTokenApiSlice;

export const { useChangePasswordMutation } = authApiSlice;
