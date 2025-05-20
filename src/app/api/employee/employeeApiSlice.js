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
      providesTags: ['Employee'],
    }),
    getEmployeeDetail: builder.mutation({
      query: (id) => ({
        url: `${API.employee}/${id}`,
        method: "GET"
      }),
    }),
    createEmployee: builder.mutation({
      query: (payload) => ({
        url: `${API.employee}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `${API.employee}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.employee}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailMutation,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
} = authApiSlice;
