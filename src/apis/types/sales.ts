/**
 * This file contains TypeScript interfaces related to Sales.
 */

import { PageableObject, SortObject } from './utility';

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
  storeId: number;
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
