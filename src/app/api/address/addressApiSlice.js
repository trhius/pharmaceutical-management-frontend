import { API } from '../endpoints';
import { apiSlice, noAuthApiSlice } from '../apiSlice';

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: (params) => ({
        url: `${API.address}/public/province`,
        method: "GET",
        params
      }),
    }),
    getDistricts: builder.mutation({
      query: (params) => ({
        url: `${API.address}/public/district`,
        method: "GET",
        params
      }),
    }),
    getWards: builder.mutation({
      query: (params) => ({
        url: `${API.address}/public/ward`,
        method: "GET",
        params
      }),
    }),
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAddress: builder.mutation({
      query: (payload) => ({
        url: `${API.address}`,
        method: 'POST',
        body: { ...payload },
      }),
      invalidatesTags: ['Address'],
    }),
    getAllAddresses: builder.query({
      query: (params) => ({
        url: API.address,
        method: 'GET',
        params,
      }),
      providesTags: ['Address'],
    }),
    getAddressDetail: builder.query({
      query: (id) => ({
        url: `${API.address}/${id}`,
        method: 'GET',
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `${API.address}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.address}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});


export const {
  useGetProvincesQuery,
  useGetDistrictsMutation,
  useGetWardsMutation
} = noTokenApiSlice;

export const {
  useGetAllAddressesQuery,
  useGetAddressDetailQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} = authApiSlice;
