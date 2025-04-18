import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeName: builder.mutation({
      query: (payload) => ({
        url: `${API.user}/update-name`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    updateAvatar: builder.mutation({
      query: (payload) => ({
        url: `${API.user}/update-avatar`,
        method: 'PATCH',
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: API.user,
        method: "GET",
        params
      }),
      providesTags: ['User'],
    }),
    getUserDetail: builder.mutation({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "GET"
      }),
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${API.user}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.user}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUsers: builder.mutation({
      query: (ids) => ({
        url: `${API.user}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useChangeNameMutation,
  useUpdateAvatarMutation,
  useGetAllUsersQuery,
  useGetUserDetailMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useDeleteUsersMutation
} = authApiSlice;
