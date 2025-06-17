import { useMutation, UseMutationResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  PagePurchaseResponse,
  PurchaseListRequest,
  PurchaseDetailsResponse,
  PurchaseImportRequest,
  PurchasePreviewResponse,
  PurchasePreviewErrorResponse,
} from '../types/purchase';
import { StringResponse } from '../types/utility';
import { purchase } from '../services/purchase';

export const usePurchaseOrders = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request?: PurchaseListRequest;
}): UseQueryResult<PagePurchaseResponse, Error> => {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => purchase.getPurchaseOrders(params),
  });
};

export const useExportPurchaseOrders = (): UseMutationResult<Blob, Error, { request: PurchaseListRequest; lang?: string }> => {
    return useMutation({
        mutationFn: purchase.exportPurchaseOrders
    });
};

export const useCancelPurchaseOrder = (): UseMutationResult<StringResponse, Error, number> =>
  useMutation({
    mutationFn: purchase.cancelPurchaseOrder,
  });

export const usePurchaseOrderDetails = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<PurchaseDetailsResponse, Error> =>
  useQuery({
    queryKey: ['purchaseOrderDetails', id],
    queryFn: () => purchase.getPurchaseOrderDetails(id),
    enabled: options?.enabled ?? !!id,
  });

export const usePurchaseOrderPreview = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<PurchasePreviewResponse, Error> =>
  useQuery({
    queryKey: ['purchaseOrderPreview', id],
    queryFn: () => purchase.getPurchaseOrderPreview(id),
    enabled: options?.enabled ?? !!id,
  });

export const useImportPurchaseOrder = (): UseMutationResult<StringResponse, Error, PurchaseImportRequest> =>
  useMutation({
    mutationFn: purchase.importPurchaseOrder,
  });

export const usePreviewPurchaseOrder = (): UseMutationResult<
  PurchasePreviewResponse | PurchasePreviewErrorResponse,
  Error,
  File
> =>
  useMutation({
    mutationFn: purchase.previewPurchaseOrder,
  });
