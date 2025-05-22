/**
 * This file contains the API service functions and React Query hooks
 * generated from the OpenAPI (Swagger) schema.
 * It uses Axios for HTTP requests and React Query for data fetching and caching.
 */

import axios from 'axios';
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from './types'; // Import all generated types

// Base URL from the Swagger JSON
const BASE_URL = 'http://34.57.217.137:8080';

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header (e.g., after login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// --- API Functions ---

// Authentication APIs
export const auth = {
  /**
   * Login
   * Authenticate user and return JWT token
   * POST /api/auth/login
   */
  login: (data: Types.LoginRequest): Promise<Types.LoginResponse> =>
    apiClient.post('/api/auth/login', data).then((res) => res.data),

  /**
   * Refresh token
   * Get new access token using refresh token
   * POST /api/auth/refresh-token
   */
  refreshToken: (data: Types.TokenRefreshRequest): Promise<Types.TokenRefreshResponse> =>
    apiClient.post('/api/auth/refresh-token', data).then((res) => res.data),

  /**
   * Forgot Password
   * Send password reset link to user's email
   * POST /api/auth/forgot-password
   */
  forgotPassword: (data: Types.ForgotPasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/auth/forgot-password', data).then((res) => res.data),

  /**
   * Reset Password
   * Reset password using token from email
   * POST /api/auth/reset-password
   */
  resetPassword: (data: Types.ResetPasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/auth/reset-password', data).then((res) => res.data),

  /**
   * Change Password
   * Change authenticated user's password
   * POST /api/account/change-password
   */
  changePassword: (data: Types.ChangePasswordRequest): Promise<Types.StringResponse> =>
    apiClient.post('/api/account/change-password', data).then((res) => res.data),

  /**
   * Verify Reset Token
   * Verify if password reset token is valid
   * GET /api/auth/verify-reset-token
   */
  verifyResetToken: (token: string): Promise<boolean> =>
    apiClient.get(`/api/auth/verify-reset-token?token=${token}`).then((res) => res.data),
};

// Account APIs
export const account = {
  /**
   * Get account info
   * GET /api/account/info
   */
  getAccountInfo: (): Promise<Types.EmployeeResponse> => apiClient.get('/api/account/info').then((res) => res.data),

  /**
   * Update account info
   * PUT /api/account/info
   */
  updateAccountInfo: (data: Types.UpdateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.put('/api/account/info', data).then((res) => res.data),
};

// Supplier Management APIs
export const supplier = {
  /**
   * Add new supplier
   * POST /api/suppliers/add
   */
  addSupplier: (data: Types.SupplierRequest): Promise<Types.SupplierResponse> =>
    apiClient.post('/api/suppliers/add', data).then((res) => res.data),

  /**
   * Edit supplier
   * POST /api/suppliers/{id}/edit
   */
  updateSupplier: (id: number, data: Types.SupplierRequest): Promise<Types.SupplierResponse> =>
    apiClient.post(`/api/suppliers/${id}/edit`, data).then((res) => res.data),

  /**
   * Deactivate (soft delete) supplier
   * POST /api/suppliers/{id}/deactivate
   */
  deactivateSupplier: (id: number): Promise<Types.StringResponse> =>
    apiClient.post(`/api/suppliers/${id}/deactivate`).then((res) => res.data),

  /**
   * Get paginated list of suppliers with search
   * GET /api/suppliers/list
   */
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

  /**
   * Export suppliers list to Excel
   * GET /api/suppliers/export
   * Returns a binary string (blob)
   */
  exportSuppliers: (params: { request: Types.SupplierListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/suppliers/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};

// Sales APIs
export const sales = {
  /**
   * Create a new order
   * POST /api/sales
   */
  createOrder: (data: Types.CreateOrderRequest): Promise<Types.OrderDetailsResponse> =>
    apiClient.post('/api/sales', data).then((res) => res.data),

  /**
   * Cancel an order
   * POST /api/sales/{orderId}/cancel
   */
  cancelOrder: (orderId: number): Promise<Types.StringResponse> =>
    apiClient.post(`/api/sales/${orderId}/cancel`).then((res) => res.data),

  /**
   * Recommend supplements
   * Call after each product is added to the cart
   * POST /api/sales/recommend-supplements
   */
  recommendSupplements: (data: Types.RecommendRequest): Promise<Types.RecommendResponse[]> =>
    apiClient.post('/api/sales/recommend-supplements', data).then((res) => res.data),

  /**
   * Get an order details by ID
   * GET /api/sales/{orderId}
   */
  getOrderDetails: (orderId: number): Promise<Types.OrderDetailsResponse> =>
    apiClient.get(`/api/sales/${orderId}`).then((res) => res.data),

  /**
   * Get a list of orders
   * GET /api/sales/list
   */
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

  /**
   * Export orders list to Excel
   * GET /api/sales/export
   * Returns a binary string (blob)
   */
  exportOrders: (params: { request: Types.OrderListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/sales/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};

// Product Management APIs
export const product = {
  /**
   * Update product prices
   * PUT /api/products/prices/edit
   */
  updateProductPrice: (data: Types.UpdateProductPriceRequest): Promise<Types.StringResponse> =>
    apiClient.put('/api/products/prices/edit', data).then((res) => res.data),

  /**
   * Get product details by ID
   * GET /api/products/{id}
   */
  getProductDetails: (id: number): Promise<Types.ProductDetailsResponse> =>
    apiClient.get(`/api/products/${id}`).then((res) => res.data),

  /**
   * Get product prices with pagination and filtering
   * GET /api/products/prices
   */
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

  /**
   * Export product prices
   * GET /api/products/prices/export
   * Returns a binary string (blob)
   */
  exportProductPrices: (params: { request: Types.GetProductPriceRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/products/prices/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),

  /**
   * Get all measurement units
   * GET /api/products/measurement-units
   */
  getMeasurementUnits: (): Promise<Types.MeasurementUnitResponse[]> =>
    apiClient.get('/api/products/measurement-units').then((res) => res.data),

  /**
   * Get products with pagination and filtering, optionally by category
   * GET /api/products/list
   */
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

  /**
   * Export products list to Excel
   * GET /api/products/export
   * Returns a binary string (blob)
   */
  exportProducts: (params: { request: Types.GetProductRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/products/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),

  /**
   * Get all categories
   * GET /api/products/categories
   */
  getAllCategories: (): Promise<Types.GetListCategoryResponse[]> =>
    apiClient.get('/api/products/categories').then((res) => res.data),

  /**
   * Get category by type
   * GET /api/products/categories/type
   */
  getCategoriesByType: (slug: string): Promise<Types.GetListCategoryResponse[]> =>
    apiClient.get(`/api/products/categories/type?slug=${slug}`).then((res) => res.data),
};

// Employee Management APIs
export const employee = {
  /**
   * Update employee details
   * POST /api/employees/{id}/edit
   */
  updateEmployeeDetails: (id: number, data: Types.UpdateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.post(`/api/employees/${id}/edit`, data).then((res) => res.data),

  /**
   * Create a new store
   * POST /api/employees/stores/add
   */
  createStore: (data: Types.CreateStoreRequest): Promise<Types.StoreResponse> =>
    apiClient.post('/api/employees/stores/add', data).then((res) => res.data),

  /**
   * Create a new employee
   * POST /api/employees/add
   */
  createEmployee: (data: Types.CreateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.post('/api/employees/add', data).then((res) => res.data),

  /**
   * Get employee details by ID
   * GET /api/employees/{id}
   */
  getEmployeeDetails: (id: number): Promise<Types.EmployeeResponse> =>
    apiClient.get(`/api/employees/${id}`).then((res) => res.data),

  /**
   * Delete employee by ID
   * DELETE /api/employees/{id}
   */
  deleteEmployee: (id: number): Promise<Types.StringResponse> =>
    apiClient.delete(`/api/employees/${id}`).then((res) => res.data),

  /**
   * Get list of all stores
   * GET /api/employees/stores
   */
  getAllStores: (): Promise<Types.StoreResponse[]> => apiClient.get('/api/employees/stores').then((res) => res.data),

  /**
   * Get paginated list of employees
   * GET /api/employees/list
   */
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

  /**
   * Export employees list to Excel
   * GET /api/employees/export
   * Returns a binary string (blob)
   */
  exportEmployees: (params: { request: Types.ListEmployeeRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/employees/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};

// Customer Management APIs
export const customer = {
  /**
   * Add new customer
   * POST /api/customers/add
   */
  addCustomer: (data: Types.CustomerRequest): Promise<Types.CustomerResponse> =>
    apiClient.post('/api/customers/add', data).then((res) => res.data),

  /**
   * Edit customer
   * POST /api/customers/{id}/edit
   */
  updateCustomer: (id: number, data: Types.CustomerRequest): Promise<Types.CustomerResponse> =>
    apiClient.post(`/api/customers/${id}/edit`, data).then((res) => res.data),

  /**
   * Deactivate (soft delete) customer
   * DELETE /api/customers/{id}
   */
  deactivateCustomer: (id: number): Promise<Types.StringResponse> =>
    apiClient.delete(`/api/customers/${id}`).then((res) => res.data),

  /**
   * Get paginated list of customers with search
   * GET /api/customers/list
   */
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

  /**
   * Export customers list to Excel
   * GET /api/customers/export
   * Returns a binary string (blob)
   */
  exportCustomers: (params: { request: Types.CustomerListRequest; lang?: string }): Promise<Blob> =>
    apiClient
      .get('/api/customers/export', { params: { ...params.request, lang: params.lang }, responseType: 'blob' })
      .then((res) => res.data),
};

// --- React Query Hooks ---

// Authentication Hooks
export const useLogin = (): UseMutationResult<Types.LoginResponse, Error, Types.LoginRequest> =>
  useMutation({
    mutationFn: auth.login,
  });

export const useRefreshToken = (): UseMutationResult<Types.TokenRefreshResponse, Error, Types.TokenRefreshRequest> =>
  useMutation({
    mutationFn: auth.refreshToken,
  });

export const useForgotPassword = (): UseMutationResult<Types.StringResponse, Error, Types.ForgotPasswordRequest> =>
  useMutation({
    mutationFn: auth.forgotPassword,
  });

export const useResetPassword = (): UseMutationResult<Types.StringResponse, Error, Types.ResetPasswordRequest> =>
  useMutation({
    mutationFn: auth.resetPassword,
  });

export const useChangePassword = (): UseMutationResult<Types.StringResponse, Error, Types.ChangePasswordRequest> =>
  useMutation({
    mutationFn: auth.changePassword,
  });

export const useVerifyResetToken = (token: string, options?: { enabled?: boolean }): UseQueryResult<boolean, Error> =>
  useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: () => auth.verifyResetToken(token),
    enabled: options?.enabled ?? !!token, // Only fetch if token is available
  });

// Account Hooks
export const useAccountInfo = (): UseQueryResult<Types.EmployeeResponse, Error> =>
  useQuery({
    queryKey: ['accountInfo'],
    queryFn: account.getAccountInfo,
  });

export const useUpdateAccountInfo = (): UseMutationResult<Types.EmployeeResponse, Error, Types.UpdateEmployeeRequest> =>
  useMutation({
    mutationFn: account.updateAccountInfo,
  });

// Supplier Management Hooks
export const useAddSupplier = (): UseMutationResult<Types.SupplierResponse, Error, Types.SupplierRequest> =>
  useMutation({
    mutationFn: supplier.addSupplier,
  });

export const useUpdateSupplier = (): UseMutationResult<
  Types.SupplierResponse,
  Error,
  { id: number; data: Types.SupplierRequest }
> =>
  useMutation({
    mutationFn: ({ id, data }) => supplier.updateSupplier(id, data),
  });

export const useDeactivateSupplier = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: supplier.deactivateSupplier,
  });

export const useSuppliers = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  request: Types.SupplierListRequest;
}): UseQueryResult<Types.PageSupplierResponse, Error> =>
  useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => supplier.getSuppliers(params),
  });

export const useExportSuppliers = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.SupplierListRequest; lang?: string }
> =>
  useMutation({
    mutationFn: supplier.exportSuppliers,
  });

// Sales Hooks
export const useCreateOrder = (): UseMutationResult<Types.OrderDetailsResponse, Error, Types.CreateOrderRequest> =>
  useMutation({
    mutationFn: sales.createOrder,
  });

export const useCancelOrder = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: sales.cancelOrder,
  });

export const useRecommendSupplements = (): UseMutationResult<
  Types.RecommendResponse[],
  Error,
  Types.RecommendRequest
> =>
  useMutation({
    mutationFn: sales.recommendSupplements,
  });

export const useOrderDetails = (
  orderId: number,
  options?: { enabled?: boolean }
): UseQueryResult<Types.OrderDetailsResponse, Error> =>
  useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => sales.getOrderDetails(orderId),
    enabled: options?.enabled ?? !!orderId,
  });

export const useListOrders = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request: Types.OrderListRequest;
}): UseQueryResult<Types.PageOrderListResponse, Error> =>
  useQuery({
    queryKey: ['listOrders', params],
    queryFn: () => sales.getListOrders(params),
  });

export const useExportOrders = (): UseMutationResult<Blob, Error, { request: Types.OrderListRequest; lang?: string }> =>
  useMutation({
    mutationFn: sales.exportOrders,
  });

// Product Management Hooks
export const useUpdateProductPrice = (): UseMutationResult<
  Types.StringResponse,
  Error,
  Types.UpdateProductPriceRequest
> =>
  useMutation({
    mutationFn: product.updateProductPrice,
  });

export const useProductDetails = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<Types.ProductDetailsResponse, Error> =>
  useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => product.getProductDetails(id),
    enabled: options?.enabled ?? !!id,
  });

export const useProductPrices = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request: Types.GetProductPriceRequest;
}): UseQueryResult<Types.PageProductPriceListResponse, Error> =>
  useQuery({
    queryKey: ['productPrices', params],
    queryFn: () => product.getProductPrices(params),
  });

export const useExportProductPrices = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.GetProductPriceRequest; lang?: string }
> =>
  useMutation({
    mutationFn: product.exportProductPrices,
  });

export const useMeasurementUnits = (): UseQueryResult<Types.MeasurementUnitResponse[], Error> =>
  useQuery({
    queryKey: ['measurementUnits'],
    queryFn: product.getMeasurementUnits,
  });

export const useProducts = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request: Types.GetProductRequest;
}): UseQueryResult<Types.PageProductResponse, Error> =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => product.getProducts(params),
  });

export const useExportProducts = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.GetProductRequest; lang?: string }
> =>
  useMutation({
    mutationFn: product.exportProducts,
  });

export const useAllCategories = (): UseQueryResult<Types.GetListCategoryResponse[], Error> =>
  useQuery({
    queryKey: ['allCategories'],
    queryFn: product.getAllCategories,
  });

export const useCategoriesByType = (
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<Types.GetListCategoryResponse[], Error> =>
  useQuery({
    queryKey: ['categoriesByType', slug],
    queryFn: () => product.getCategoriesByType(slug),
    enabled: options?.enabled ?? !!slug,
  });

// Employee Management Hooks
export const useUpdateEmployeeDetails = (): UseMutationResult<
  Types.EmployeeResponse,
  Error,
  { id: number; data: Types.UpdateEmployeeRequest }
> =>
  useMutation({
    mutationFn: ({ id, data }) => employee.updateEmployeeDetails(id, data),
  });

export const useCreateStore = (): UseMutationResult<Types.StoreResponse, Error, Types.CreateStoreRequest> =>
  useMutation({
    mutationFn: employee.createStore,
  });

export const useCreateEmployee = (): UseMutationResult<Types.EmployeeResponse, Error, Types.CreateEmployeeRequest> =>
  useMutation({
    mutationFn: employee.createEmployee,
  });

export const useEmployeeDetails = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<Types.EmployeeResponse, Error> =>
  useQuery({
    queryKey: ['employeeDetails', id],
    queryFn: () => employee.getEmployeeDetails(id),
    enabled: options?.enabled ?? !!id,
  });

export const useDeleteEmployee = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: employee.deleteEmployee,
  });

export const useAllStores = (): UseQueryResult<Types.StoreResponse[], Error> =>
  useQuery({
    queryKey: ['allStores'],
    queryFn: employee.getAllStores,
  });

export const useListEmployees = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  request: Types.ListEmployeeRequest;
}): UseQueryResult<Types.PageEmployeeResponse, Error> =>
  useQuery({
    queryKey: ['listEmployees', params],
    queryFn: () => employee.getListEmployees(params),
  });

export const useExportEmployees = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.ListEmployeeRequest; lang?: string }
> =>
  useMutation({
    mutationFn: employee.exportEmployees,
  });

// Customer Management Hooks
export const useAddCustomer = (): UseMutationResult<Types.CustomerResponse, Error, Types.CustomerRequest> =>
  useMutation({
    mutationFn: customer.addCustomer,
  });

export const useUpdateCustomer = (): UseMutationResult<
  Types.CustomerResponse,
  Error,
  { id: number; data: Types.CustomerRequest }
> =>
  useMutation({
    mutationFn: ({ id, data }) => customer.updateCustomer(id, data),
  });

export const useDeactivateCustomer = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: customer.deactivateCustomer,
  });

export const useCustomers = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  request: Types.CustomerListRequest;
}): UseQueryResult<Types.PageCustomerResponse, Error> =>
  useQuery({
    queryKey: ['customers', params],
    queryFn: () => customer.getCustomers(params),
  });

export const useExportCustomers = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.CustomerListRequest; lang?: string }
> =>
  useMutation({
    mutationFn: customer.exportCustomers,
  });
