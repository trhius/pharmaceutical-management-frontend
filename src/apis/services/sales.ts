import * as Types from '../types';
import { apiClient } from '../client';

export const sales = {
  createOrder: (data: Types.CreateOrderRequest): Promise<Types.OrderDetailsResponse> =>
    apiClient.post('/api/sales', data).then((res) => res.data),

  cancelOrder: (orderId: number): Promise<Types.StringResponse> =>
    apiClient.post(`/api/sales/${orderId}/cancel`).then((res) => res.data),

  recommendSupplements: (data: Types.RecommendRequest): Promise<Types.RecommendResponse[]> =>
    apiClient.post('/api/sales/recommend-supplements', data).then((res) => res.data),

  getOrderDetails: (orderId: number): Promise<Types.OrderDetailsResponse> =>
    apiClient.get(`/api/sales/${orderId}`).then((res) => res.data),

  getListOrders: (params: {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    size?: number;
    request: Types.OrderListRequest;
  }): Promise<Types.PageOrderListResponse> =>
    apiClient
      .get('/api/sales/list', {
        params: {
          ...params.request,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          page: params.page,
          size: params.size,
        },
      })
      .then((res) => res.data),

  exportOrders: (params: { request: Types.OrderListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/sales/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};
