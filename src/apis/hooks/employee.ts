import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { employee } from '../services/employee';

export const useUpdateEmployeeDetails = (): UseMutationResult<
  Types.EmployeeResponse,
  Error,
  { id: number; data: Types.UpdateEmployeeRequest }
> =>
  useMutation({
    mutationFn: ({ id, data }) => employee.updateEmployeeDetails(id, data),
  });

export const useCreateStore = (): UseMutationResult<Types.StoreResponse, Error, Types.CreateStoreRequest> =>
  useMutation({
    mutationFn: employee.createStore,
  });

export const useCreateEmployee = (): UseMutationResult<Types.EmployeeResponse, Error, Types.CreateEmployeeRequest> =>
  useMutation({
    mutationFn: employee.createEmployee,
  });

export const useEmployeeDetails = (
  id: number,
  options?: { enabled?: boolean }
): UseQueryResult<Types.EmployeeResponse, Error> =>
  useQuery({
    queryKey: ['employeeDetails', id],
    queryFn: () => employee.getEmployeeDetails(id),
    enabled: options?.enabled ?? !!id,
  });

export const useDeleteEmployee = (): UseMutationResult<Types.StringResponse, Error, number> =>
  useMutation({
    mutationFn: employee.deleteEmployee,
  });

export const useAllStores = (): UseQueryResult<Types.StoreResponse[], Error> =>
  useQuery({
    queryKey: ['allStores'],
    queryFn: employee.getAllStores,
  });

export const useListEmployees = (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  request: Types.ListEmployeeRequest;
}): UseQueryResult<Types.PageEmployeeResponse, Error> =>
  useQuery({
    queryKey: ['listEmployees', params],
    queryFn: () => employee.getListEmployees(params),
  });

export const useExportEmployees = (): UseMutationResult<
  Blob,
  Error,
  { request: Types.ListEmployeeRequest; lang?: string }
> =>
  useMutation({
    mutationFn: employee.exportEmployees,
  });
