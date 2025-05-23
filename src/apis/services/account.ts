import * as Types from '../types';
import { apiClient } from '../client';

export const account = {
  getAccountInfo: (): Promise<Types.EmployeeResponse> => apiClient.get('/api/account/info').then((res) => res.data),

  updateAccountInfo: (data: Types.UpdateEmployeeRequest): Promise<Types.EmployeeResponse> =>
    apiClient.put('/api/account/info', data).then((res) => res.data),
};
