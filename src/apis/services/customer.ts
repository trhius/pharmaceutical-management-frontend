import * as Types from '../types';
import { apiClient } from '../client';

export const customer = {
  addCustomer: (data: Types.CustomerRequest): Promise<Types.CustomerResponse> =>
    apiClient.post('/api/customers/add', data).then((res) => res.data),

  updateCustomer: (id: number, data: Types.CustomerRequest): Promise<Types.CustomerResponse> =>
    apiClient.post(`/api/customers/${id}/edit`, data).then((res) => res.data),

  deactivateCustomer: (id: number): Promise<Types.StringResponse> =>
    apiClient.delete(`/api/customers/${id}`).then((res) => res.data),

  getCustomers: (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: string;
    request: Types.CustomerListRequest;
  }): Promise<Types.PageCustomerResponse> =>
    apiClient
      .get('/api/customers/list', {
        params: {
          ...params.request,
          page: params.page,
          size: params.size,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      })
      .then((res) => res.data),

  exportCustomers: (params: { request: Types.CustomerListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/customers/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};
