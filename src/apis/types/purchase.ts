/**
 * This file contains TypeScript interfaces related to Purchase Management.
 */

import { PageableObject, SortObject } from "./utility";

export type PurchaseOrderStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierName: string;
  createdBy: string;
  createdAt: string;
  finalAmount: number;
  status: PurchaseOrderStatus;
}

export interface PurchaseListRequest {
  page?: number;
  size?: number;
  search?: string;
  searchBy?: 'CODE' | 'NAME';
  createdDateFrom?: string; // date-time format
  createdDateTo?: string; // date-time format
  status?: PurchaseOrderStatus;
  createdBy?: string;
}

export interface PurchaseDetailsResponse {
  id?: number;
  code?: string;
  supplierName?: string;
  createdAt?: string; // date-time format
  createdBy?: string;
  status?: PurchaseOrderStatus;
  storeName?: string;
  totalAmount?: number;
  discount?: number;
  finalAmount?: number;
  totalItems?: number;
  totalQuantity?: number;
  note?: string;
  purchaseItems?: PurchaseItemResponse[];
}

export interface PurchaseItemResponse {
  id?: number;
  productCode?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  measurementUnitName?: string;
  batchNumber?: string;
  manufacturingDate?: string; // date format
  expirationDate?: string; // date format
}

export interface PurchaseListResponse {
  id?: number;
  code?: string;
  supplierName?: string;
  finalAmount?: number;
  createdAt?: string; // date-time format
  createdBy?: string;
  status?: PurchaseOrderStatus;
}

export interface PurchaseImportRequest {}

export interface PurchasePreviewItemResponse {
  index?: number;
  productCode?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  measurementUnitName?: string;
  batchNumber?: string;
  manufacturingDate?: string; // date format
  expirationDate?: string; // date format
}

export interface PurchasePreviewResponse {
  totalItems?: number;
  totalQuantity?: number;
  totalPrice?: number;
  items?: PurchasePreviewItemResponse[];
}

export interface PurchasePreviewErrorResponse {
  errors?: string[];
}

export interface PagePurchaseResponse {
  totalElements?: number;
  totalPages?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  size?: number;
  content?: PurchaseListResponse[];
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}