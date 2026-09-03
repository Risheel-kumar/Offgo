import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services/scheduleService';
import {
  ScheduleItem,
  ScheduleFilterOptions,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from '../types';

export const SCHEDULES_QUERY_KEY = 'schedules';

/**
 * Custom hook to fetch schedules list with optional filtering
 */
export const useSchedules = (filters?: ScheduleFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<ScheduleItem[], Error>({
    queryKey: [SCHEDULES_QUERY_KEY, filters],
    queryFn: () => scheduleService.getSchedules(filters),
    staleTime: 1000 * 30, // 30s stale time
  });

  const allSchedulesQuery = useQuery<ScheduleItem[], Error>({
    queryKey: [SCHEDULES_QUERY_KEY, 'all'],
    queryFn: () => scheduleService.getSchedules(),
    staleTime: 1000 * 30,
    refetchInterval: 5000,
  });

  return {
    schedules: query.data || [],
    allSchedules: allSchedulesQuery.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => {
      query.refetch();
      allSchedulesQuery.refetch();
    },
    invalidateSchedules: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  };
};

/**
 * Custom hook to fetch a single schedule details by ID
 */
export const useSchedule = (id: string | null) => {
  return useQuery<ScheduleItem, Error>({
    queryKey: [SCHEDULES_QUERY_KEY, id],
    queryFn: () => scheduleService.getScheduleById(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

/**
 * Custom hook to create a new schedule (trip assignment)
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleItem, Error, CreateSchedulePayload>({
    mutationFn: (payload) => scheduleService.createSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing schedule
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleItem, Error, UpdateSchedulePayload>({
    mutationFn: (payload) => scheduleService.updateSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to delete a schedule
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => scheduleService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
};
