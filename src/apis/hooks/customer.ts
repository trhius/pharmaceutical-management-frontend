import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { customer } from '../services/customer';

export const useAddCustomer = (): UseMutationResult<Types.CustomerResponse, Error, Types.CreateCustomerRequest> =>
  useMutation({
    mutationFn: customer.addCustomer,
  });

export const useUpdateCustomer = (): UseMutationResult<
  Types.CustomerResponse,
  Error,
  { id: number; data: Types.CreateCustomerRequest }
> =>
  useMutation({
    mutationFn: ({ id, data }) => customer.updateCustomer(id, data),
  });

export const useDeactivateCustomer = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: customer.deactivateCustomer,
  });

export const useCustomers = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  enabled?: boolean;
  request: Types.CustomerListRequest;
}): UseQueryResult<Types.PageCustomerResponse, Error> =>
  useQuery({
    queryKey: ['customers', params.request], // Use the request object from params for query key
    queryFn: () => customer.getCustomers(params),
    enabled: params.enabled,
  });

export const useExportCustomers = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.CustomerListRequest; lang?: string }
> =>
  useMutation({
    mutationFn: customer.exportCustomers,
  });
