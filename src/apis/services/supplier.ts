import * as Types from '../types';
import { apiClient } from '../client';

export const supplier = {
  addSupplier: (data: Types.SupplierRequest): Promise<Types.SupplierResponse> =>
    apiClient.post('/api/suppliers/add', data).then((res) => res.data),

  updateSupplier: (id: number, data: Types.SupplierRequest): Promise<Types.SupplierResponse> =>
    apiClient.post(`/api/suppliers/${id}/edit`, data).then((res) => res.data),

  deactivateSupplier: (id: number): Promise<Types.StringResponse> =>
    apiClient.post(`/api/suppliers/${id}/deactivate`).then((res) => res.data),

  getSuppliers: (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: string;
    request: Types.SupplierListRequest;
  }): Promise<Types.PageSupplierResponse> =>
    apiClient
      .get('/api/suppliers/list', {
        params: {
          ...params.request,
          page: params.page,
          size: params.size,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      })
      .then((res) => res.data),

  exportSuppliers: (params: { request: Types.SupplierListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/suppliers/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};
