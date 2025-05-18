import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params) => ({
        url: `${API.employee}/list`,
        method: "GET",
        params
      }),
      providesTags: ['User'],
    }),
    getUserDetail: builder.mutation({
      query: (id) => ({
        url: `${API.employee}/${id}`,
        method: "GET"
      }),
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `${API.employee}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${API.employee}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.employee}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUsers: builder.mutation({
      query: (ids) => ({
        url: `${API.employee}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetEmployeesQuery
} = authApiSlice;
