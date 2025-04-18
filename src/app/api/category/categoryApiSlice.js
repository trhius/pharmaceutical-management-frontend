import { API } from "../endpoints";
import { apiSlice, noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTree: builder.query({
      query: (params) => ({
        url: `${API.category}/tree`,
        method: "GET",
        params
      }),
    }),
    getCategoryFilter: builder.query({
      query: (params) => ({
        url: `${API.category}/filter`,
        method: "GET",
        params
      }),
    }),
  }),
});

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (params) => ({
        url: API.category,
        method: "GET",
        params
      }),
      providesTags: ['Category'],
    }),
    getCategoryDetail: builder.mutation({
      query: (id) => ({
        url: `${API.category}/${id}`,
        method: "GET"
      }),
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: `${API.category}`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${API.category}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.category}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategories: builder.mutation({
      query: (ids) => ({
        url: `${API.category}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { 
  useGetCategoryTreeQuery,
  useGetCategoryFilterQuery
} = noTokenApiSlice;

export const {
  useGetAllCategoriesQuery,
  useGetCategoryDetailMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoriesMutation
} = categoryApiSlice;