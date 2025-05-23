/**
 * This file contains TypeScript interfaces related to Customer Management.
 */

import { PageableObject, SortObject } from "./utility";

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
