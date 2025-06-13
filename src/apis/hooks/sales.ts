import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { sales } from '../services/sales';

export const useCreateOrder = (): UseMutationResult<Types.OrderDetailsResponse, Error, Types.CreateOrderRequest> =>
  useMutation({
    mutationFn: sales.createOrder,
  });

export const useCancelOrder = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: sales.cancelOrder,
  });

export const useRecommendSupplements = (): UseMutationResult<
  Types.RecommendResponse,
  Error,
  Types.RecommendRequest
> =>
  useMutation({
    mutationFn: sales.recommendSupplements,
  });

export const useOrderDetails = (
  orderId: number,
  options?: { enabled?: boolean }
): UseQueryResult<Types.OrderDetailsResponse, Error> =>
  useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => sales.getOrderDetails(orderId),
    enabled: options?.enabled ?? !!orderId,
  });

export const useListOrders = (params: {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
  request: Types.OrderListRequest;
}): UseQueryResult<Types.PageOrderListResponse, Error> =>
  useQuery({
    queryKey: ['listOrders', params],
    queryFn: () => sales.getListOrders(params),
  });

export const useExportOrders = (): UseMutationResult<Blob, Error, { request: Types.OrderListRequest; lang?: string }> =>
  useMutation({
    mutationFn: sales.exportOrders,
  });
