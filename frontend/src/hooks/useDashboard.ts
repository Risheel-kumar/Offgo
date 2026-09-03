import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin', 'dashboard'];
export const LIVE_TRACKING_QUERY_KEY = ['admin', 'live-tracking'];

export function useAdminDashboard(options?: { refetchInterval?: number }) {
  const dashboardQuery = useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getAdminDashboardData(),
    refetchInterval: options?.refetchInterval ?? 30000, // Auto refresh every 30s
    staleTime: 10000,
  });

  const liveTrackingQuery = useQuery({
    queryKey: LIVE_TRACKING_QUERY_KEY,
    queryFn: () => dashboardService.getLiveTracking(),
    refetchInterval: 10000, // Live shuttle map updates every 10s
    staleTime: 5000,
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    isFetching: dashboardQuery.isFetching,
    refetch: dashboardQuery.refetch,

    liveTracking: liveTrackingQuery.data || dashboardQuery.data?.liveTracking || [],
    isLiveTrackingLoading: liveTrackingQuery.isLoading,
    refetchLiveTracking: liveTrackingQuery.refetch,
  };
}
