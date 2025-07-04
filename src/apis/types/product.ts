/**
 * This file contains TypeScript interfaces related to Product Management.
 */

import { PageableObject, SortObject } from './utility';

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
  children?: CategoryResponse[];
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

  productName: string;
  shortenName: string;
  createdAt: string;
  categoriesExpand: object[];
  pricesExpand: object[];
  usage: string;
  supplierNames: string[];
  batchNumbers: string[];
  totalQuantity: number;
  soldQuantity: number;
}

export interface ProductPriceResponse {
  id?: number;
  measurementUnitId?: number;
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
  productId?: number;
  productCode?: string;
  productName?: string;
  prices?: ProductPriceResponse;
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
  page?: number;
  size?: number;
  createdDateFrom?: string;
  createdDateTo?: string;
}

export interface ProductResponse {
  id: number;
  productCode?: string;
  productName?: string;
  shortenName?: string;
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
  defaultPrice?: ProductPriceResponse;
  totalQuantity?: number;
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
  children?: GetListCategoryResponse[];
}
