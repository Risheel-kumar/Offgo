import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverPortalService } from '../services/driverPortalService';
import {
  DriverProfile,
  DriverTripStatistics,
  LiveTripItem,
  TripPassenger,
  PassengerBoardingStatus,
  TripStatus,
} from '../types';

export const DRIVER_PROFILE_KEY = 'driver_profile';
export const ASSIGNED_TRIPS_KEY = 'assigned_trips';
export const CURRENT_TRIP_KEY = 'driver_current_trip';
export const PASSENGER_MANIFEST_KEY = 'passenger_manifest';
export const DRIVER_STATS_KEY = 'driver_statistics';

export const useDriverProfile = () => {
  return useQuery<DriverProfile, Error>({
    queryKey: [DRIVER_PROFILE_KEY],
    queryFn: () => driverPortalService.getDriverProfile(),
    staleTime: 30000,
  });
};

export const useUpdateDriverProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<DriverProfile, Error, Partial<DriverProfile>>({
    mutationFn: (updated) => driverPortalService.updateDriverProfile(updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DRIVER_PROFILE_KEY] });
    },
  });
};

export const useAssignedTrips = () => {
  return useQuery<LiveTripItem[], Error>({
    queryKey: [ASSIGNED_TRIPS_KEY],
    queryFn: () => driverPortalService.getAssignedTrips(),
    refetchInterval: 10000,
  });
};

export const useCurrentTrip = () => {
  return useQuery<LiveTripItem | null, Error>({
    queryKey: [CURRENT_TRIP_KEY],
    queryFn: () => driverPortalService.getCurrentTrip(),
    refetchInterval: 5000,
  });
};

export const usePassengerManifest = (tripId: string | null) => {
  return useQuery<TripPassenger[], Error>({
    queryKey: [PASSENGER_MANIFEST_KEY, tripId],
    queryFn: () => driverPortalService.getPassengerManifest(tripId!),
    enabled: !!tripId,
    refetchInterval: 10000,
  });
};

export const useUpdatePassengerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    boolean,
    Error,
    { tripId: string; passengerId: string; status: PassengerBoardingStatus }
  >({
    mutationFn: ({ tripId, passengerId, status }) =>
      driverPortalService.updatePassengerBoardingStatus(tripId, passengerId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PASSENGER_MANIFEST_KEY, variables.tripId] });
      queryClient.invalidateQueries({ queryKey: [CURRENT_TRIP_KEY] });
      queryClient.invalidateQueries({ queryKey: [ASSIGNED_TRIPS_KEY] });
    },
  });
};

export const useUpdateTripStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { tripId: string; status: TripStatus }>({
    mutationFn: ({ tripId, status }) => driverPortalService.updateTripStatus(tripId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENT_TRIP_KEY] });
      queryClient.invalidateQueries({ queryKey: [ASSIGNED_TRIPS_KEY] });
      queryClient.invalidateQueries({ queryKey: [DRIVER_STATS_KEY] });
    },
  });
};

export const useDriverStatistics = () => {
  return useQuery<DriverTripStatistics, Error>({
    queryKey: [DRIVER_STATS_KEY],
    queryFn: () => driverPortalService.getDriverStatistics(),
    staleTime: 30000,
  });
};
