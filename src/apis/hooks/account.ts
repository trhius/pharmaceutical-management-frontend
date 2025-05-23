import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as Types from '../types';
import { account } from '../services/account';

export const useAccountInfo = (): UseQueryResult<Types.EmployeeResponse, Error> =>
  useQuery({
    queryKey: ['accountInfo'],
    queryFn: account.getAccountInfo,
  });

export const useUpdateAccountInfo = (): UseMutationResult<Types.EmployeeResponse, Error, Types.UpdateEmployeeRequest> =>
  useMutation({
    mutationFn: account.updateAccountInfo,
  });
