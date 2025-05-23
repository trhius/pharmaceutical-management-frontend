import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { product } from '../services/product';

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
