import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeePortalService } from '../services/employeePortalService';
import {
  EmployeeProfile,
  CommuteAnalytics,
  Booking,
  LiveTripItem,
} from '../types';

export const MY_PROFILE_QUERY_KEY = 'my_profile';
export const TODAY_TRIP_QUERY_KEY = 'my_today_trip';
export const MY_UPCOMING_BOOKINGS_QUERY_KEY = 'my_upcoming_bookings';
export const MY_BOOKING_HISTORY_QUERY_KEY = 'my_booking_history';
export const COMMUTE_ANALYTICS_QUERY_KEY = 'my_commute_analytics';

export const useMyProfile = () => {
  return useQuery<EmployeeProfile, Error>({
    queryKey: [MY_PROFILE_QUERY_KEY],
    queryFn: () => employeePortalService.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<EmployeeProfile, Error, Partial<EmployeeProfile>>({
    mutationFn: (payload) => employeePortalService.updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_PROFILE_QUERY_KEY] });
    },
  });
};

export const useTodayTrip = () => {
  return useQuery<LiveTripItem | null, Error>({
    queryKey: [TODAY_TRIP_QUERY_KEY],
    queryFn: () => employeePortalService.getTodayTrip(),
    refetchInterval: 10000, // 10s live tracking refresh
  });
};

export const useMyUpcomingBookings = () => {
  return useQuery<Booking[], Error>({
    queryKey: [MY_UPCOMING_BOOKINGS_QUERY_KEY],
    queryFn: () => employeePortalService.getUpcomingBookings(),
    staleTime: 1000 * 30,
  });
};

export const useMyBookingHistory = () => {
  return useQuery<Booking[], Error>({
    queryKey: [MY_BOOKING_HISTORY_QUERY_KEY],
    queryFn: () => employeePortalService.getBookingHistory(),
    staleTime: 1000 * 60,
  });
};

export const useCommuteAnalytics = () => {
  return useQuery<CommuteAnalytics, Error>({
    queryKey: [COMMUTE_ANALYTICS_QUERY_KEY],
    queryFn: () => employeePortalService.getCommuteAnalytics(),
    staleTime: 1000 * 60 * 10,
  });
};
