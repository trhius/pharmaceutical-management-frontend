import * as Types from '../types';
import { apiClient } from '../client';

export const employee = {
  updateEmployeeDetails: (id: number, data: Types.UpdateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.post(`/api/employees/${id}/edit`, data).then((res) => res.data),

  createStore: (data: Types.CreateStoreRequest): Promise<Types.StoreResponse> =>
    apiClient.post('/api/employees/stores/add', data).then((res) => res.data),

  createEmployee: (data: Types.CreateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.post('/api/employees/add', data).then((res) => res.data),

  getEmployeeDetails: (id: number): Promise<Types.EmployeeResponse> =>
    apiClient.get(`/api/employees/${id}`).then((res) => res.data),

  deleteEmployee: (id: number): Promise<Types.StringResponse> =>
    apiClient.delete(`/api/employees/${id}`).then((res) => res.data),

  getAllStores: (): Promise<Types.StoreResponse[]> => apiClient.get('/api/employees/stores').then((res) => res.data),

  getListEmployees: (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: string;
    request: Types.ListEmployeeRequest;
  }): Promise<Types.PageEmployeeResponse> =>
    apiClient
      .get('/api/employees/list', {
        params: {
          ...params.request,
          page: params.page,
          size: params.size,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      })
      .then((res) => res.data),

  exportEmployees: (params: { request: Types.ListEmployeeRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/employees/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};
