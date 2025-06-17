import { apiClient } from '../client';
import { DashboardData } from '../types/dashboard';

export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await apiClient.get('/api/dashboard/overview');
  return data;
};
