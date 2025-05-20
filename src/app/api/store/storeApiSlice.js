import { API } from "../endpoints";
import { apiSlice } from "../apiSlice";

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStores: builder.query({
      query: (params) => ({
        url: `${API.employee}/stores`,
        method: "GET",
        params
      }),
      providesTags: ['Store'],
    }),
    getStore: builder.query({
      query: (id) => ({
        url: `${API.employee}/stores/${id}`,
        method: "GET"
      }),
      providesTags: ['Store'],
    }),
    createStore: builder.mutation({
      query: (payload) => ({
        url: `${API.employee}/stores/add`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Store'],
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `${API.employee}/stores/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.employee}/stores/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetAllStoresQuery,
  useGetStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storeApiSlice;