import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stopService } from '../services/stopService';
import {
  StopDetailItem,
  StopFilterOptions,
  CreateStopPayload,
  UpdateStopPayload,
} from '../types';

export const STOPS_QUERY_KEY = 'stops';

/**
 * Custom Hook to fetch filtered stops list
 */
export const useStops = (filters?: StopFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<StopDetailItem[], Error>({
    queryKey: [STOPS_QUERY_KEY, filters],
    queryFn: () => stopService.getStops(filters),
    staleTime: 1000 * 30, // 30 seconds
  });

  const allStopsQuery = useQuery<StopDetailItem[], Error>({
    queryKey: [STOPS_QUERY_KEY, 'all'],
    queryFn: () => stopService.getStops(),
    staleTime: 1000 * 30,
  });

  return {
    stops: query.data || [],
    allStops: allStopsQuery.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: () => {
      query.refetch();
      allStopsQuery.refetch();
    },
    invalidateStops: () => {
      queryClient.invalidateQueries({ queryKey: [STOPS_QUERY_KEY] });
    },
  };
};

/**
 * Custom Hook to fetch a single stop by ID
 */
export const useStop = (id: string | null) => {
  return useQuery<StopDetailItem, Error>({
    queryKey: [STOPS_QUERY_KEY, id],
    queryFn: () => stopService.getStopById(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

/**
 * Custom Hook to create a new stop
 */
export const useCreateStop = () => {
  const queryClient = useQueryClient();

  return useMutation<StopDetailItem, Error, CreateStopPayload>({
    mutationFn: (payload) => stopService.createStop(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOPS_QUERY_KEY] });
    },
  });
};

/**
 * Custom Hook to update an existing stop
 */
export const useUpdateStop = () => {
  const queryClient = useQueryClient();

  return useMutation<StopDetailItem, Error, UpdateStopPayload>({
    mutationFn: (payload) => stopService.updateStop(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOPS_QUERY_KEY] });
    },
  });
};

/**
 * Custom Hook to delete a stop
 */
export const useDeleteStop = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => stopService.deleteStop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOPS_QUERY_KEY] });
    },
  });
};
