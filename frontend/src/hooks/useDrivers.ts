import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../services/driverService';
import {
  Driver,
  CreateDriverPayload,
  DriverFilterOptions,
  DriverAssignedShuttle,
  DriverAssignedRoute,
} from '../types';

export const DRIVERS_QUERY_KEY = ['drivers'];

export function useDrivers(filters?: DriverFilterOptions) {
  const query = useQuery({
    queryKey: [...DRIVERS_QUERY_KEY, filters],
    queryFn: () => driverService.getDrivers(filters),
    staleTime: 30000,
  });

  const allQuery = useQuery({
    queryKey: [...DRIVERS_QUERY_KEY, 'all'],
    queryFn: () => driverService.getDrivers(),
    staleTime: 30000,
  });

  return {
    drivers: query.data || [],
    allDrivers: allQuery.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useDriver(id?: string) {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => (id ? driverService.getDriverById(id) : null),
    enabled: !!id,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();

  return useMutation<Driver, Error, CreateDriverPayload>({
    mutationFn: (payload: CreateDriverPayload) => driverService.createDriver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
    },
  });
}

export function useUpdateDriverAssignment() {
  const queryClient = useQueryClient();

  return useMutation<Driver, Error, {
    id: string;
    shuttle?: DriverAssignedShuttle | null;
    route?: DriverAssignedRoute | null;
  }>({
    mutationFn: ({
      id,
      shuttle,
      route,
    }: {
      id: string;
      shuttle?: DriverAssignedShuttle | null;
      route?: DriverAssignedRoute | null;
    }) => driverService.updateDriverAssignment(id, shuttle, route),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
      queryClient.invalidateQueries({ queryKey: ['driver', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard-schedules'] });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id: string) => driverService.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_QUERY_KEY });
    },
  });
}
