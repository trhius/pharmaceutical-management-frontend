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
      query: (email) => ({
        url: `users/auth/reset-password-request?email=${email}`,
        method: 'GET',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `users/auth/reset-password?token=${token}`,
        method: 'PATCH',
        body: { newPassword },
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
  useResetPasswordMutation,
  useRemoveRefreshTokenMutation,
} = noTokenApiSlice;

export const { useChangePasswordMutation } = authApiSlice;
