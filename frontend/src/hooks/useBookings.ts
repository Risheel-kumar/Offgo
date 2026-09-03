import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import {
  BookingDetailItem,
  BookingFilterOptions,
  CreateBookingPayload,
  UpdateBookingPayload,
} from '../types';

export const BOOKINGS_QUERY_KEY = 'bookings';

/**
 * Custom hook to fetch list of bookings with filtering
 */
export const useBookings = (filters?: BookingFilterOptions) => {
  const queryClient = useQueryClient();

  const allBookingsQuery = useQuery<BookingDetailItem[], Error>({
    queryKey: [BOOKINGS_QUERY_KEY, 'all'],
    queryFn: () => bookingService.getBookings(),
    staleTime: 0,
    refetchInterval: 5000,
  });

  const searchQuery = filters?.searchQuery?.trim().toLowerCase() || '';
  const bookings = (allBookingsQuery.data || []).filter((booking) => {
    const matchesSearch = !searchQuery || `${booking.code} ${booking.employeeName} ${booking.shuttleNumber} ${booking.routeName}`.toLowerCase().includes(searchQuery);
    const matchesStatus = !filters?.bookingStatusFilter || filters.bookingStatusFilter === 'ALL' || booking.bookingStatus === filters.bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    bookings,
    allBookings: allBookingsQuery.data || [],
    isLoading: allBookingsQuery.isLoading,
    isFetching: allBookingsQuery.isFetching,
    error: allBookingsQuery.error,
    refetch: () => {
      allBookingsQuery.refetch();
    },
    invalidateBookings: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  };
};

/**
 * Custom hook to fetch a single booking details by ID
 */
export const useBooking = (id: string | null) => {
  return useQuery<BookingDetailItem, Error>({
    queryKey: [BOOKINGS_QUERY_KEY, id],
    queryFn: () => bookingService.getBookingById(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

/**
 * Custom hook to create a new shuttle booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingDetailItem, Error, CreateBookingPayload>({
    mutationFn: (payload) => bookingService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingDetailItem, Error, UpdateBookingPayload>({
    mutationFn: (payload) => bookingService.updateBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to delete / cancel a booking
 */
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => bookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });
};
