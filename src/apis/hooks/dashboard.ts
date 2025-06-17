import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services/dashboard';

const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboardData = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: getDashboardData,
  });
};
