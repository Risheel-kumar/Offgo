import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shuttleService } from '../services/shuttleService';
import {
  ShuttleDetailItem,
  CreateShuttlePayload,
  UpdateShuttlePayload,
  ShuttleFilterOptions,
} from '../types';

export const SHUTTLES_QUERY_KEY = ['shuttles'];

export function useShuttles(filters?: ShuttleFilterOptions) {
  const allQuery = useQuery({
    queryKey: [...SHUTTLES_QUERY_KEY, 'all'],
    queryFn: () => shuttleService.getShuttles(),
    staleTime: 30000,
  });

  const allShuttles = allQuery.data || [];
  const searchQuery = filters?.searchQuery?.trim().toLowerCase() || '';
  const shuttles = allShuttles.filter((shuttle) => {
    const matchesSearch = !searchQuery || [
      shuttle.vehicleNumber,
      shuttle.vehicleType,
      shuttle.manufacturer,
      shuttle.model,
      shuttle.assignedRoute?.name || '',
    ].some((value) => value.toLowerCase().includes(searchQuery));
    const matchesStatus = !filters?.statusFilter || filters.statusFilter === 'ALL' || shuttle.status === filters.statusFilter;
    const matchesCapacity = !filters?.capacityFilter || filters.capacityFilter === 'ALL' ||
      (filters.capacityFilter === 'SMALL' && shuttle.capacity <= 15) ||
      (filters.capacityFilter === 'MEDIUM' && shuttle.capacity > 15 && shuttle.capacity <= 30) ||
      (filters.capacityFilter === 'LARGE' && shuttle.capacity > 30);
    return matchesSearch && matchesStatus && matchesCapacity;
  });

  return {
    shuttles,
    allShuttles,
    isLoading: allQuery.isLoading,
    isFetching: allQuery.isFetching,
    isError: allQuery.isError,
    error: allQuery.error,
    refetch: allQuery.refetch,
  };
}

export function useShuttle(id?: string) {
  return useQuery({
    queryKey: ['shuttle', id],
    queryFn: () => (id ? shuttleService.getShuttleById(id) : null),
    enabled: !!id,
  });
}

export function useCreateShuttle() {
  const queryClient = useQueryClient();

  return useMutation<ShuttleDetailItem, Error, CreateShuttlePayload>({
    mutationFn: (payload: CreateShuttlePayload) => shuttleService.createShuttle(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<ShuttleDetailItem[]>([...SHUTTLES_QUERY_KEY, 'all'], (current = []) => [
        created,
        ...current.filter((shuttle) => shuttle.id !== created.id),
      ]);
      queryClient.invalidateQueries({ queryKey: SHUTTLES_QUERY_KEY, refetchType: 'active' });
    },
  });
}

export function useUpdateShuttle() {
  const queryClient = useQueryClient();

  return useMutation<ShuttleDetailItem, Error, UpdateShuttlePayload>({
    mutationFn: (payload: UpdateShuttlePayload) => shuttleService.updateShuttle(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<ShuttleDetailItem[]>([...SHUTTLES_QUERY_KEY, 'all'], (current = []) =>
        current.map((shuttle) => shuttle.id === updated.id ? updated : shuttle)
      );
      queryClient.invalidateQueries({ queryKey: SHUTTLES_QUERY_KEY, refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ['shuttle', updated.id] });
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['driver-dashboard-schedules'] });
    },
  });
}

export function useUpdateShuttleStatus() {
  const queryClient = useQueryClient();
  return useMutation<ShuttleDetailItem, Error, { id: string; status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' }>({
    mutationFn: ({ id, status }) => shuttleService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<ShuttleDetailItem[]>([...SHUTTLES_QUERY_KEY, 'all'], (current = []) => current.map((item) => item.id === updated.id ? updated : item));
      queryClient.invalidateQueries({ queryKey: SHUTTLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['fleet-operations'] });
    },
  });
}

export function useDeleteShuttle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shuttleService.deleteShuttle(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ShuttleDetailItem[]>([...SHUTTLES_QUERY_KEY, 'all'], (current = []) =>
        current.filter((shuttle) => shuttle.id !== id)
      );
      queryClient.invalidateQueries({ queryKey: SHUTTLES_QUERY_KEY, refetchType: 'active' });
    },
  });
}
