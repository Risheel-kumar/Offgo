import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '../services/tripService';
import {
  LiveTripItem,
  TripHistoryItem,
  TripStopItem,
  TripFilterOptions,
  PassengerBoardingStatus,
} from '../types';

export const TRIPS_QUERY_KEY = 'live_trips';
export const TRIP_HISTORY_QUERY_KEY = 'trip_history';
export const ETA_QUERY_KEY = 'trip_eta';

/**
 * Custom hook to fetch active trips list with auto 10s polling interval
 */
export const useTrips = (filters?: TripFilterOptions) => {
  const queryClient = useQueryClient();

  const query = useQuery<LiveTripItem[], Error>({
    queryKey: [TRIPS_QUERY_KEY, filters],
    queryFn: () => tripService.getLiveTrips(filters),
    refetchInterval: 10000, // Poll every 10 seconds as required by specification
    staleTime: 5000,
  });

  return {
    trips: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: () => query.refetch(),
    invalidateTrips: () => {
      queryClient.invalidateQueries({ queryKey: [TRIPS_QUERY_KEY] });
    },
  };
};

/**
 * Custom hook to fetch a single live tracking shuttle trip by shuttleId
 */
export const useLiveTracking = (shuttleId: string | null) => {
  return useQuery<LiveTripItem, Error>({
    queryKey: [TRIPS_QUERY_KEY, 'tracking', shuttleId],
    queryFn: () => tripService.getTripByShuttleId(shuttleId!),
    enabled: !!shuttleId,
    refetchInterval: 10000, // Poll every 10 seconds
  });
};

/**
 * Custom hook to fetch current stop for a shuttle
 */
export const useCurrentStop = (shuttleId: string | null) => {
  return useQuery<TripStopItem, Error>({
    queryKey: [TRIPS_QUERY_KEY, 'current_stop', shuttleId],
    queryFn: () => tripService.getCurrentStop(shuttleId!),
    enabled: !!shuttleId,
    refetchInterval: 10000,
  });
};

/**
 * Custom hook to fetch ETA information
 */
export const useETA = (shuttleId: string | null) => {
  return useQuery({
    queryKey: [ETA_QUERY_KEY, shuttleId],
    queryFn: () => tripService.getETA(shuttleId!),
    enabled: !!shuttleId,
    refetchInterval: 10000,
  });
};

/**
 * Custom hook to fetch trip history
 */
export const useTripHistory = (shuttleId?: string) => {
  return useQuery<TripHistoryItem[], Error>({
    queryKey: [TRIP_HISTORY_QUERY_KEY, shuttleId],
    queryFn: () => tripService.getTripHistory(shuttleId),
    staleTime: 1000 * 60,
  });
};

/**
 * Custom hook to update passenger boarding status (Waiting, Boarded, Dropped, No Show)
 */
export const useUpdatePassengerBoardingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { tripId: string; passengerId: string; boardingStatus: PassengerBoardingStatus }
  >({
    mutationFn: ({ tripId, passengerId, boardingStatus }) =>
      tripService.updatePassengerBoardingStatus(tripId, passengerId, boardingStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRIPS_QUERY_KEY] });
    },
  });
};
