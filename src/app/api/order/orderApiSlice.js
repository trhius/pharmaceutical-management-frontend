import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params) => ({
        url: API.order,
        method: 'GET',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderDetail: builder.query({
      query: (code) => ({
        url: `${API.order}/${code}/detail`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    getOrderDetailById: builder.query({
      query: (id) => ({
        url: `${API.order}/${id}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: `${API.order}`,
        method: 'POST',
        body: { ...payload },
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${API.order}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.order}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrders: builder.mutation({
      query: (ids) => ({
        url: `${API.order}/${ids.join()}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.order}/${id}/update-status`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Order', 'OrderDetail'],
    }),
    bulkAction: builder.mutation({
      query: (payload) => ({
        url: `${API.order}/bulk-action`,
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `${API.order}/${id}/cancel-order`,
        method: "PATCH"
      }),
      invalidatesTags: ['Order', 'OrderDetail'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailQuery,
  useDeleteOrderMutation,
  useDeleteOrdersMutation,
  useUpdateOrderMutation,
  useBulkActionMutation,
  useUpdateOrderStatusMutation,
  useGetOrderDetailByIdQuery,
  useCancelOrderMutation
} = orderApiSlice;
