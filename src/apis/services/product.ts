import * as Types from '../types';
import { apiClient } from '../client';

export const product = {
  updateProductPrice: (data: Types.UpdateProductPriceRequest): Promise<Types.StringResponse> =>
    apiClient.put('/api/products/prices/edit', data).then((res) => res.data),

  getProductDetails: (id: number): Promise<Types.ProductDetailsResponse> =>
    apiClient.get(`/api/products/${id}`).then((res) => res.data),

  getProductPrices: (params: {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    size?: number;
    request: Types.GetProductPriceRequest;
  }): Promise<Types.PageProductPriceListResponse> =>
    apiClient
      .get('/api/products/prices', {
        params: {
          ...params.request,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          page: params.page,
          size: params.size,
        },
      })
      .then((res) => res.data),

  exportProductPrices: (params: { request: Types.GetProductPriceRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/products/prices/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),

  getMeasurementUnits: (): Promise<Types.MeasurementUnitResponse[]> =>
    apiClient.get('/api/products/measurement-units').then((res) => res.data),

  getProducts: (params: {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    size?: number;
    request: Types.GetProductRequest;
  }): Promise<Types.PageProductResponse> =>
    apiClient
      .get('/api/products/list', {
        params: {
          ...params.request,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          page: params.page,
          size: params.size,
        },
      })
      .then((res) => res.data),

  exportProducts: (params: { request: Types.GetProductRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/products/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),

  getAllCategories: (): Promise<Types.GetListCategoryResponse[]> =>
    apiClient.get('/api/products/categories').then((res) => res.data),

  getCategoriesByType: (slug: string): Promise<Types.GetListCategoryResponse[]> =>
    apiClient.get(`/api/products/categories/type?slug=${slug}`).then((res) => res.data),
};
