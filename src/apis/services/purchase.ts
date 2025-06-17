import * as Types from '../types';
import { apiClient } from '../client';

export const purchase = {
  getPurchaseOrders: (params: {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    size?: number;
    request?: Types.PurchaseListRequest;
  }): Promise<Types.PagePurchaseResponse> =>
    apiClient.get('/api/purchases/list', {
      params: {
        ...params.request,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        page: params.page,
        size: params.size,
      },
    })
    .then((res) => res.data),

  exportPurchaseOrders: (params: { request: Types.PurchaseListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/purchases/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),

  cancelPurchaseOrder: (id: number): Promise<Types.StringResponse> =>
    apiClient.post(`/api/purchases/${id}/cancel`).then((res) => res.data),

  getPurchaseOrderDetails: (id: number): Promise<Types.PurchaseDetailsResponse> =>
    apiClient.get(`/api/purchases/${id}`).then((res) => res.data),

  getPurchaseOrderPreview: (id: number): Promise<Types.PurchasePreviewResponse> =>
    apiClient.get(`/api/purchases/${id}/preview`).then((res) => res.data),

  importPurchaseOrder: (data: Types.PurchaseImportRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/purchases/import', data).then((res) => res.data),

  previewPurchaseOrder: (file: File): Promise<Types.PurchasePreviewResponse | Types.PurchasePreviewErrorResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post('/api/purchases/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data);
  },
};