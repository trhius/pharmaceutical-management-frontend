import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAccount: builder.mutation({
      query: (payload) => ({
        url: `${API.account}/info`,
        method: 'PUT',
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    getAccountInfo: builder.query({
      query: () => ({
        url: `${API.account}/info`,
        method: "GET"
      }),
      providesTags: ['User'],
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `${API.account}/change-password`,
        method: 'POST',
        body: { ...payload },
      }),
    }),
  }),
});

export const {
  useUpdateAccountMutation,
  useGetAccountInfoQuery,
  useUpdatePasswordMutation,
} = authApiSlice;
