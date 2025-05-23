/**
 * This file contains TypeScript interfaces related to Supplier Management.
 */

import { PageableObject, SortObject } from "./utility";

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
