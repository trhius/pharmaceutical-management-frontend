/**
 * This file contains all the TypeScript interfaces generated from the OpenAPI (Swagger) schema.
 * These types are used throughout the application for consistent data handling.
 */

// Utility types for pagination and sorting
export interface PageableObject {
  pageNumber?: number;
  paged?: boolean;
  pageSize?: number;
  offset?: number;
  sort?: SortObject;
  unpaged?: boolean;
}

export interface SortObject {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}

// Global Response Types
export interface StringResponse {
  message?: string;
}

// Authentication Schemas
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  userInfo?: UserInfoResponse;
}

export interface UserInfoResponse {
  id?: number;
  email?: string;
  role?: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  firstTimeLogin?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

// Employee Management Schemas
export interface UpdateEmployeeRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  storeId?: number;
  role?: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';
  dateOfBirth?: string; // date format
  identityCardNo?: string;
  joinDate?: string; // date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}

export interface EmployeeResponse {
  id?: number;
  employeeCode?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  role?: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';
  storeId?: number;
  storeName?: string;
  storeAddress?: string;
  address?: string;
  dateOfBirth?: string; // date format
  identityCard?: string;
  joinDate?: string; // date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt?: string; // date-time format
  createdBy?: string;
  updatedAt?: string; // date-time format
  updatedBy?: string;
}

export interface CreateStoreRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface StoreResponse {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  storeId?: number;
  dateOfBirth?: string; // date format
  identityCardNo?: string;
  joinDate?: string; // date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface ListEmployeeRequest {
  storeId?: number;
  role?: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';
  search?: string;
  commonSearchBy?: 'NAME' | 'CODE' | 'PHONE';
}

export interface PageEmployeeResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: EmployeeResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

// Supplier Management Schemas
export interface SupplierRequest {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

export interface SupplierResponse {
  id?: number;
  code?: string;
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  isActive?: boolean;
  createdAt?: string; // date-time format
  createdBy?: string;
  updatedAt?: string; // date-time format
  updatedBy?: string;
}

export interface SupplierListRequest {
  search?: string;
  searchBy?: 'NAME' | 'CODE' | 'PHONE';
  fromDate?: string; // date-time format
  toDate?: string; // date-time format
  isActive?: boolean;
}

export interface PageSupplierResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: SupplierResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

// Sales Schemas
export interface CreateOrderItemRequest {
  productId?: number;
  batchId?: number;
  measurementUnitId?: number;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  discountAmount?: number;
  discountPercent?: number;
  finalPrice?: number;
}

export interface PrescriptionInfoRequest {
  prescriptionCode?: string;
  doctorName?: string;
  hospitalName?: string;
  patientName?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  weight?: number;
  address?: string;
  guardianName?: string;
  contactPhone?: string;
  insuranceCard?: string;
  diagnosis?: string;
}

export interface CreateOrderRequest {
  customerId?: number;
  storeId?: number;
  items?: CreateOrderItemRequest[];
  note?: string;
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER';
  totalAmount?: number;
  amountPaid?: number;
  changeGiven?: number;
  discountAmount?: number;
  discountPercent?: number;
  finalAmount?: number;
  prescriptionInfo?: PrescriptionInfoRequest;
}

export interface OrderItemResponse {
  id?: number;
  productName?: string;
  productCode?: string;
  quantity?: number;
  unit?: string;
  price?: string;
  discount?: string;
  totalAmount?: string;
  finalAmount?: string;
}

export interface PrescriptionResponse {
  id?: number;
  orderId?: number;
  prescriptionCode?: string;
  doctorName?: string;
  hospitalName?: string;
  patientName?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  weight?: number;
  address?: string;
  guardianName?: string;
  contactPhone?: string;
  insuranceCard?: string;
  diagnosis?: string;
}

export interface OrderDetailsResponse {
  id?: number;
  code?: string;
  customerName?: string;
  customerPhone?: string;
  soldBy?: string;
  storeName?: string;
  totalAmount?: string;
  discountAmount?: string;
  finalAmount?: string;
  amountPaid?: string;
  changeGiven?: string;
  status?: 'NEW' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER';
  paymentStatus?: 'PAID' | 'UNPAID' | 'PARTIAL';
  byPrescription?: boolean;
  createdAt?: string; // date-time format
  createdBy?: string;
  updatedAt?: string; // date-time format
  updatedBy?: string;
  note?: string;
  orderItems?: OrderItemResponse[];
  prescription?: PrescriptionResponse;
}

export interface RecommendRequest {
  productIds?: number[];
}

export interface RecommendResponse {
  // This schema is empty in the OpenAPI spec.
  // You might want to define its actual structure if known.
  [key: string]: any;
}

export interface OrderListRequest {
  search?: string;
  searchBy?: 'ORDER_CODE' | 'CUSTOMER_NAME' | 'CUSTOMER_PHONE';
  createdDateFrom?: string; // date-time format
  createdDateTo?: string; // date-time format
  createBy?: string;
  soldBy?: string;
  finalAmountFrom?: number;
  finalAmountTo?: number;
  status?: 'NEW' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER';
  byPrescription?: boolean;
}

export interface OrderListResponse {
  id?: number;
  code?: string;
  customerName?: string;
  customerPhone?: string;
  finalAmount?: string;
  status?: 'NEW' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'OTHER';
  byPrescription?: boolean;
  createdAt?: string; // date-time format
  soldBy?: string;
  orderItems?: OrderItemResponse[];
  prescription?: PrescriptionResponse;
}

export interface PageOrderListResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: OrderListResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

// Product Management Schemas
export interface UpdateProductPriceRequest {
  productId?: number;
  measurementUnitId?: number;
  sellingPrice?: string;
}

export interface CategoryResponse {
  id?: number;
  name?: string;
  slug?: string;
  level?: number;
}

export interface ProductDetailsResponse {
  id?: number;
  productCode?: string;
  name?: string;
  webName?: string;
  slug?: string;
  imageUrl?: string;
  brand?: string;
  ingredients?: string;
  dosageForm?: string;
  specification?: string;
  type?: 'DRUG' | 'SUPPLEMENT';
  isActive?: boolean;
  categories?: CategoryResponse[];
  prices?: ProductPriceResponse[];
  chiDinh?: string;
  cachDung?: string;
  lieuDung?: string;
  chongChiDinh?: string;
  thanTrongKhiSuDung?: string;
  tuongTacThuoc?: string;
  thoiKyMangThaiChoConBu?: string;
  anhHuongLaiXe?: string;
}

export interface ProductPriceResponse {
  id?: number;
  measurementUnitName?: string;
  purchasePrice?: number;
  price?: number;
  currencySymbol?: string;
  isDefault?: boolean;
}

export interface GetProductPriceRequest {
  categorySlug?: string;
  search?: string;
  searchBy?: 'NAME' | 'CODE' | 'PHONE';
  measurementUnitId?: number;
  fromPrice?: string;
  toPrice?: string;
}

export interface ProductPriceListResponse {
  productCode?: string;
  productName?: string;
  prices?: ProductPriceResponse[];
}

export interface PageProductPriceListResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: ProductPriceListResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface MeasurementUnitResponse {
  id?: number;
  code?: string;
  name?: string;
}

export interface GetProductRequest {
  categorySlug?: string;
  search?: string;
  searchBy?: 'NAME' | 'CODE' | 'PHONE';
  brand?: string;
  isActive?: boolean;
}

export interface ProductResponse {
  id?: number;
  productCode?: string;
  name?: string;
  webName?: string;
  slug?: string;
  imageUrl?: string;
  brand?: string;
  ingredients?: string;
  dosageForm?: string;
  specification?: string;
  type?: 'DRUG' | 'SUPPLEMENT';
  isActive?: boolean;
  categories?: CategoryResponse[];
  prices?: ProductPriceResponse[];
}

export interface PageProductResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: ProductResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface GetListCategoryResponse {
  id?: number;
  name?: string;
  slug?: string;
  level?: number;
}

// Customer Management Schemas
export interface CustomerRequest {
  name?: string;
  phoneNumber?: string;
  email?: string;
  dayOfBirth?: string; // date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
}

export interface CustomerResponse {
  id?: number;
  customerCode?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  dayOfBirth?: string; // date format
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  ageGroup?: 'CHILD' | 'TEEN' | 'ADULT' | 'ELDERLY';
  totalSpentAmount?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';
  createdAt?: string; // date-time format
  createdBy?: string;
  updatedAt?: string; // date-time format
  updatedBy?: string;
}

export interface CustomerListRequest {
  search?: string;
  searchBy?: 'CUSTOMER_CODE' | 'NAME' | 'PHONE_NUMBER' | 'EMAIL' | 'ADDRESS';
  createdDateFrom?: string; // date-time format
  createdDateTo?: string; // date-time format
  createBy?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthDateFrom?: string; // date format
  birthDateTo?: string; // date format
  spentAmountFrom?: string;
  spentAmountTo?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED';
}

export interface PageCustomerResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: CustomerResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}
