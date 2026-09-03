import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import {
  EnterpriseNotification,
  NotificationFilterOptions,
} from '../types';

export const NOTIFICATIONS_QUERY_KEY = 'enterprise_notifications';
export const UNREAD_COUNT_QUERY_KEY = 'notifications_unread_count';

export const useNotifications = (filters?: NotificationFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<EnterpriseNotification[], Error>({
    queryKey: [NOTIFICATIONS_QUERY_KEY, filters],
    queryFn: () => notificationService.getNotifications(filters),
    refetchInterval: 15000, // Refresh notifications every 15s
    staleTime: 5000,
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: () => query.refetch(),
    invalidateNotifications: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  };
};

export const useNotification = (id: string | null) => {
  return useQuery<EnterpriseNotification | null, Error>({
    queryKey: [NOTIFICATIONS_QUERY_KEY, id],
    queryFn: () => notificationService.getNotificationById(id!),
    enabled: !!id,
  });
};

export const useUnreadCount = () => {
  return useQuery<number, Error>({
    queryKey: [UNREAD_COUNT_QUERY_KEY],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 10000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  });
};

export const useMarkAsUnread = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => notificationService.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, void>({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  });
};

export const useClearReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, void>({
    mutationFn: () => notificationService.clearReadNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  });
};
