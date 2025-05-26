import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { product } from '../services/product';
import {
  UpdateProductPriceRequest,
  ProductDetailsResponse,
  GetProductPriceRequest,
  PageProductPriceListResponse,
  MeasurementUnitResponse,
  GetProductRequest,
  PageProductResponse,
  GetListCategoryResponse,
} from '../types/product';
import { StringResponse } from '../types/utility';

export const useUpdateProductPrice = (): UseMutationResult<StringResponse, Error, UpdateProductPriceRequest> =>
  useMutation({
    mutationFn: product.updateProductPrice,
  });

export const useProductDetails = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<ProductDetailsResponse, Error> =>
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
  request: GetProductPriceRequest;
}): UseQueryResult<PageProductPriceListResponse, Error> =>
  useQuery({
    queryKey: ['productPrices', params],
    queryFn: () => product.getProductPrices(params),
  });

export const useExportProductPrices = (): UseMutationResult<
  Blob,
  Error,
  { request: GetProductPriceRequest; lang?: string }
> =>
  useMutation({
    mutationFn: product.exportProductPrices,
  });

export const useMeasurementUnits = (): UseQueryResult<MeasurementUnitResponse[], Error> =>
  useQuery({
    queryKey: ['measurementUnits'],
    queryFn: product.getMeasurementUnits,
  });

export const useProducts = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request: GetProductRequest;
}): UseQueryResult<PageProductResponse, Error> =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => product.getProducts(params),
  });

export const useExportProducts = (): UseMutationResult<Blob, Error, { request: GetProductRequest; lang?: string }> =>
  useMutation({
    mutationFn: product.exportProducts,
  });

export const useAllCategories = ({
  enabled,
}: {
  enabled?: boolean;
}): UseQueryResult<GetListCategoryResponse[], Error> =>
  useQuery({
    queryKey: ['allCategories'],
    queryFn: product.getAllCategories,
    enabled,
  });

export const useCategoriesByType = (
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<GetListCategoryResponse[], Error> =>
  useQuery({
    queryKey: ['categoriesByType', slug],
    queryFn: () => product.getCategoriesByType(slug),
    enabled: options?.enabled ?? !!slug,
  });

export const useBrands = ({ enabled }: { enabled?: boolean }): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: ['brands'],
    queryFn: product.getBrands,
    enabled,
  });
