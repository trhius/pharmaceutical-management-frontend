import { API } from "../endpoints";
import { apiSlice, noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({
        url: API.product,
        method: "GET",
        params
      }),
      providesTags: ['Product'],
    }),
    getProductDetail: builder.query({
      query: (slug) => ({
        url: `${API.product}/${slug}/detail`,
        method: "GET"
      }),
    }),
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query({
      query: (params) => ({
        url: API.product,
        method: "GET",
        params
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: `${API.product}`,
        method: "POST",
        body: { ...payload }
      }),
      invalidatesTags: ['Product'],
    }),
    getProductDetail: builder.mutation({
      query: (id) => ({
        url: `${API.product}/${id}`,
        method: "GET"
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${API.product}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.product}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProducts: builder.mutation({
      query: (ids) => ({
        url: `${API.product}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailQuery,
} = noTokenApiSlice;

export const {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useGetProductDetailMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
} = authApiSlice;

