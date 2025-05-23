import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { supplier } from '../services/supplier';

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
