import apiClient from '../api/axios';
import {
  DriverProfile,
  DriverTripStatistics,
  LiveTripItem,
  TripPassenger,
  PassengerBoardingStatus,
  TripStatus,
} from '../types';

const unwrap = <T,>(response: any): T => {
  if (response && response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data as T;
  }
  return response?.data ?? response;
};

const normalizeDriverProfile = (user: any): DriverProfile => ({
  id: user?.id ?? '',
  driverId: user?.employeeId ?? user?.driverId ?? '',
  fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.fullName || '',
  email: user?.email ?? '',
  phone: user?.phoneNumber ?? user?.phone ?? '',
  licenseNumber: user?.licenseNumber ?? 'N/A',
  licenseExpiry: user?.licenseExpiry ?? '',
  assignedVehicle: user?.assignedVehicle ?? user?.vehicle ?? 'Unassigned',
  assignedVehicleReg: user?.assignedVehicleReg ?? user?.vehicleNumber ?? '',
  experienceYears: Number(user?.experienceYears ?? user?.experience ?? 0),
  rating: Number(user?.rating ?? 0),
  avatarUrl: user?.avatarUrl ?? user?.avatar,
  status: user?.status === 'ON_DUTY' || user?.status === 'ON_TRIP' ? 'ON_DUTY' : 'OFF_DUTY',
});

const normalizeTrip = (schedule: any): LiveTripItem => ({
  id: String(schedule?.id ?? 'trip-current'),
  code: schedule?.code ?? schedule?.id ?? 'TRIP',
  routeId: schedule?.routeId ?? '',
  routeName: schedule?.routeName ?? 'Assigned route',
  shuttleId: schedule?.shuttleId ?? '',
  shuttleNumber: schedule?.shuttleNumber ?? '',
  vehicleModel: schedule?.shuttleModel ?? '',
  driverId: schedule?.driverId ?? '',
  driverName: schedule?.driverName ?? '',
  driverPhone: schedule?.driverPhone ?? '',
  lat: Number(schedule?.lat ?? 0),
  lng: Number(schedule?.lng ?? 0),
  heading: Number(schedule?.heading ?? 0),
  currentSpeedKmh: Number(schedule?.currentSpeedKmh ?? 0),
  status: schedule?.status ?? 'SCHEDULED',
  distanceRemainingKm: Number(schedule?.distanceRemainingKm ?? 0),
  etaMinutes: Number(schedule?.etaMinutes ?? 0),
  delayMinutes: Number(schedule?.delayMinutes ?? 0),
  startTime: schedule?.departureTime ?? '',
  currentStop: schedule?.currentStop,
  nextStop: schedule?.nextStop,
  stops: schedule?.stops ?? [],
  passengers: schedule?.passengers ?? [],
});

export const driverPortalService = {
  getDriverProfile: async (): Promise<DriverProfile> => {
    const user = unwrap<any>(await apiClient.get('/users/me'));
    return normalizeDriverProfile(user?.data ?? user);
  },

  updateDriverProfile: async (updated: Partial<DriverProfile>): Promise<DriverProfile> => {
    const current = await driverPortalService.getDriverProfile();
    try {
      const response = await apiClient.put(`/drivers/${current.id || current.driverId}`, {
        ...current,
        ...updated,
      });
      const raw = unwrap<any>(response);
      return normalizeDriverProfile(raw?.data ?? raw ?? { ...current, ...updated });
    } catch {
      return { ...current, ...updated };
    }
  },

  getAssignedTrips: async (): Promise<LiveTripItem[]> => {
    const profile = await driverPortalService.getDriverProfile();
    const response = await apiClient.get('/schedules');
    const schedules = unwrap<any[]>(response) ?? [];

    return schedules
      .filter((schedule) => {
        const sameDriver = schedule.driverId === profile.id || schedule.driverId === profile.driverId || schedule.driverName === profile.fullName;
        return sameDriver;
      })
      .map(normalizeTrip);
  },

  getCurrentTrip: async (): Promise<LiveTripItem | null> => {
    const trips = await driverPortalService.getAssignedTrips();
    const activeTrip = trips.find((trip) => ['IN_TRANSIT', 'RUNNING', 'SCHEDULED', 'ACTIVE'].includes(String(trip.status ?? '').toUpperCase()));
    return activeTrip ?? trips[0] ?? null;
  },

  getPassengerManifest: async (tripId: string): Promise<TripPassenger[]> => {
    const response = await apiClient.get('/bookings');
    const allBookings = unwrap<any[]>(response) ?? [];

    return allBookings
      .filter((booking) => booking.scheduleId === tripId || booking.schedule?.id === tripId)
      .map((booking) => ({
        id: String(booking.id),
        bookingCode: booking.bookingRef ?? booking.qrToken ?? booking.id,
        employeeId: booking.employeeId ?? booking.employee?.id ?? '',
        employeeName: booking.employeeName ?? booking.employee?.fullName ?? '',
        employeeEmail: booking.employeeEmail ?? booking.employee?.email ?? '',
        pickupStopName: booking.pickupStopName ?? booking.pickupStop ?? '',
        dropStopName: booking.dropStopName ?? booking.dropoffStop ?? '',
        bookingStatus: booking.status ?? 'PENDING',
        boardingStatus: 'WAITING',
      }));
  },

  updatePassengerBoardingStatus: async (
    tripId: string,
    passengerId: string,
    status: PassengerBoardingStatus
  ): Promise<boolean> => {
    await apiClient.patch(`/driver/trips/${tripId}/passengers/${passengerId}`, { status });
    return true;
  },

  updateTripStatus: async (tripId: string, status: TripStatus): Promise<boolean> => {
    await apiClient.patch(`/driver/trips/${tripId}/status`, { status });
    return true;
  },

  getDriverStatistics: async (): Promise<DriverTripStatistics> => {
    const profile = await driverPortalService.getDriverProfile();
    const response = await apiClient.get(`/dashboard/driver/${profile.id || profile.driverId}`);
    const raw = unwrap<any>(response);
    const data = raw?.data ?? raw ?? {};

    return {
      tripsToday: Number(data.todaysPassengers ?? 0),
      tripsCompleted: Number(data.completedTrips ?? 0),
      passengersTransported: Number(data.todaysPassengers ?? 0),
      distanceTravelledKm: Number(data.distanceTravelledKm ?? 0),
      averageTripTimeMinutes: Number(data.averageTripTimeMinutes ?? 0),
      onTimePerformancePercent: Number(data.onTimePerformancePercent ?? 0),
    };
  },
};
