/**
 * This file contains TypeScript interfaces related to Employee Management.
 */

import { PageableObject, SortObject } from "./utility";

export type EmployeeRole = 'SUPER_ADMIN' | 'STORE_MANAGER' | 'PHARMACIST' | 'INVENTORY_STAFF';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';

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
  id: number;
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
  note?: string;
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
  searchBy?: 'NAME' | 'CODE' | 'PHONE';
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
