import apiClient from '../api/axios';
import { storage } from '../utils/storage';
import {
  EmployeeProfile,
  CommuteAnalytics,
  Booking,
  LiveTripItem,
  TripStopItem,
  TripStatus,
} from '../types';

const unwrap = <T,>(response: any): T => {
  if (response && response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data as T;
  }
  return response?.data ?? response;
};

const AUTH_USER_KEY = 'offgo_auth_user';

const normalizeStopLabel = (stop: any): string => {
  if (typeof stop === 'string' || typeof stop === 'number') return String(stop);
  if (!stop || typeof stop !== 'object') return '';
  return String(stop.name ?? stop.stopName ?? stop.address ?? stop.code ?? '');
};

const normalizeTripStop = (stop: any): TripStopItem | undefined => {
  if (!stop || typeof stop !== 'object') return undefined;

  return {
    id: normalizeStopLabel(stop.id) || `stop-${stop.lat ?? 'unknown'}-${stop.lng ?? 'unknown'}`,
    name: normalizeStopLabel(stop) || 'Shuttle stop',
    lat: Number(stop.lat ?? stop.latitude ?? 0),
    lng: Number(stop.lng ?? stop.longitude ?? 0),
    estimatedArrival: normalizeStopLabel(stop.estimatedArrival ?? stop.eta ?? stop.estimatedTime),
    actualArrival: normalizeStopLabel(stop.actualArrival ?? stop.actualTime),
    isCompleted: Boolean(stop.isCompleted),
    isCurrent: Boolean(stop.isCurrent),
  };
};

const normalizeProfile = (user: any): EmployeeProfile => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || normalizeStopLabel(user?.fullName);

  return {
    id: user?.id ?? '',
    employeeId: normalizeStopLabel(user?.employeeId ?? user?.id),
    fullName,
    email: normalizeStopLabel(user?.email),
    phone: normalizeStopLabel(user?.phoneNumber ?? user?.phone),
    department: normalizeStopLabel(user?.department) || 'Operations',
    designation: normalizeStopLabel(user?.designation) || 'Employee',
    avatarUrl: normalizeStopLabel(user?.avatarUrl ?? user?.avatar) || undefined,
    homeAddress: normalizeStopLabel(user?.homeAddress),
    preferredPickupStopId: normalizeStopLabel(user?.preferredPickupStopId),
    preferredPickupStopName: normalizeStopLabel(user?.preferredPickupStopName),
    preferredDropStopId: normalizeStopLabel(user?.preferredDropStopId),
    preferredDropStopName: normalizeStopLabel(user?.preferredDropStopName),
    emergencyContactName: normalizeStopLabel(user?.emergencyContactName),
    emergencyContactPhone: normalizeStopLabel(user?.emergencyContactPhone),
    notificationPreferences: {
      email: true,
      sms: true,
      push: true,
      tripReminders: true,
      scheduleChanges: true,
    },
  };
};

const normalizeBooking = (booking: any): Booking => ({
  id: normalizeStopLabel(booking?.id),
  bookingRef: normalizeStopLabel(booking?.bookingRef ?? booking?.qrToken) || `BOOK-${normalizeStopLabel(booking?.id) || 'N/A'}`,
  employeeId: normalizeStopLabel(booking?.employeeId ?? booking?.employee?.id),
  scheduleId: normalizeStopLabel(booking?.scheduleId ?? booking?.schedule?.id),
  employeeName: normalizeStopLabel(booking?.employeeName ?? booking?.employee?.fullName),
  routeId: normalizeStopLabel(booking?.routeId ?? booking?.schedule?.routeId),
  routeName: normalizeStopLabel(booking?.routeName ?? booking?.schedule?.routeName) || 'Assigned route',
  shuttleId: normalizeStopLabel(booking?.shuttleId ?? booking?.schedule?.shuttleId),
  shuttleNumber: normalizeStopLabel(booking?.shuttleNumber ?? booking?.schedule?.shuttleNumber),
  shuttleVehicleNumber: normalizeStopLabel(booking?.shuttleNumber ?? booking?.schedule?.shuttleNumber),
  pickupStop: normalizeStopLabel(booking?.pickupStop ?? booking?.pickupStopName),
  dropoffStop: normalizeStopLabel(booking?.dropoffStop ?? booking?.dropStopName),
  pickupTime: normalizeStopLabel(booking?.pickupTime ?? booking?.schedule?.departureTime),
  seatNumber: normalizeStopLabel(booking?.seatNumber ?? booking?.seat),
  status: normalizeStopLabel(booking?.status) || 'PENDING',
  date: normalizeStopLabel(booking?.date ?? booking?.travelDate ?? booking?.schedule?.startDate) || new Date().toISOString().slice(0, 10),
});

const parseBookingDateTime = (booking: Booking) => {
  if (!booking.date) return Number.NEGATIVE_INFINITY;

  const timeText = booking.pickupTime || '00:00 AM';
  const normalized = timeText.toUpperCase().replace(/\s+/g, ' ');
  const match = normalized.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  let hour = 0;
  let minute = 0;
  if (match) {
    hour = Number(match[1]);
    minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
  }

  const date = new Date(`${booking.date}T00:00:00`);
  date.setHours(hour, minute, 0, 0);
  return date.getTime();
};

const isBookingExpired = (booking: Booking, now = new Date()) => {
  const status = String(booking?.status ?? '').toUpperCase();
  if (['CANCELLED', 'REJECTED', 'COMPLETED', 'NO_SHOW'].includes(status)) {
    return true;
  }

  if (!booking.date) {
    return true;
  }

  const bookingDate = new Date(`${booking.date}T00:00:00`);
  const today = new Date(now);
  bookingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return bookingDate < today;
};

const sortBookingsByDateTime = (bookings: Booking[], ascending = true) => {
  return [...bookings].sort((a, b) => {
    const diff = parseBookingDateTime(a) - parseBookingDateTime(b);
    return ascending ? diff : -diff;
  });
};

const normalizeTrip = (payload: any): LiveTripItem | null => {
  if (!payload) return null;

  const routeName = normalizeStopLabel(payload.routeName ?? payload.route?.routeName) || 'Assigned route';
  const shuttleNumber = normalizeStopLabel(payload.shuttleNumber ?? payload.shuttle?.vehicleNumber) || 'Unassigned';
  const routeId = normalizeStopLabel(payload.routeId ?? payload.route?.id);
  const shuttleId = normalizeStopLabel(payload.shuttleId ?? payload.shuttle?.id);
  const driverName = normalizeStopLabel(payload.driverName ?? payload.driver?.fullName);
  const currentStop = normalizeTripStop(payload.currentStop);
  const nextStop = normalizeTripStop(payload.nextStop);
  const stops = Array.isArray(payload.stops)
    ? payload.stops.map(normalizeTripStop).filter((stop): stop is TripStopItem => Boolean(stop))
    : [];

  return {
    id: String(payload.id ?? payload.scheduleId ?? 'trip-current'),
    code: normalizeStopLabel(payload.code ?? payload.bookingRef ?? payload.tripCode) || 'TRIP',
    routeId,
    routeName,
    shuttleId,
    shuttleNumber,
    driverId: normalizeStopLabel(payload.driverId ?? payload.driver?.id),
    driverName,
    driverPhone: payload.driverPhone ?? payload.driver?.phone ?? '',
    lat: Number(payload.lat ?? payload.currentLocation?.lat ?? 0),
    lng: Number(payload.lng ?? payload.currentLocation?.lng ?? 0),
    heading: Number(payload.heading ?? 0),
    currentSpeedKmh: Number(payload.currentSpeedKmh ?? payload.speedKmH ?? 0),
    status: (normalizeStopLabel(payload.status) || 'SCHEDULED') as TripStatus,
    distanceRemainingKm: Number(payload.distanceRemainingKm ?? 0),
    etaMinutes: Number(payload.etaMinutes ?? payload.eta ?? 0),
    delayMinutes: Number(payload.delayMinutes ?? 0),
    startTime: normalizeStopLabel(payload.startTime ?? payload.departureTime),
    currentStop,
    nextStop,
    stops,
    passengers: payload.passengers ?? [],
  };
};

const resolveEmployeeUuid = async (profile: EmployeeProfile): Promise<string | undefined> => {
  const employeeCode = profile.employeeId;

  if (employeeCode || profile.email) {
    try {
      const response = await apiClient.get('/employees');
      const employees = unwrap<any[]>(response) ?? [];
      const matchingEmployee = employees.find((employee: any) => {
        const candidateCode = String(employee?.employeeCode ?? employee?.employeeId ?? '').toLowerCase();
        const candidateEmail = String(employee?.email ?? '').toLowerCase();
        return (employeeCode && candidateCode === String(employeeCode).toLowerCase())
          || (profile.email && candidateEmail === String(profile.email).toLowerCase());
      });

      if (matchingEmployee?.id) {
        return String(matchingEmployee.id);
      }
    } catch {
      // Fall through to a valid authenticated UUID when the employee directory is unavailable.
    }
  }

  const explicitId = profile.id;
  if (explicitId && /^[0-9a-fA-F-]{36}$/.test(explicitId)) {
    return explicitId;
  }

  return undefined;
};

export const employeePortalService = {
  getMyProfile: async (): Promise<EmployeeProfile> => {
    const storedUser = storage.get<any>(AUTH_USER_KEY, null);
    if (storedUser?.id || storedUser?.employeeId || storedUser?.email) {
      return normalizeProfile(storedUser);
    }

    return normalizeProfile({});
  },

  updateMyProfile: async (updated: Partial<EmployeeProfile>): Promise<EmployeeProfile> => {
    const current = await employeePortalService.getMyProfile();
    const payload = { ...current, ...updated };

    try {
      const response = await apiClient.put('/users/me', payload);
      const raw = unwrap<any>(response);
      return normalizeProfile(raw?.data ?? raw ?? payload);
    } catch {
      return payload;
    }
  },

  getTodayTrip: async (): Promise<LiveTripItem | null> => {
    const profile = await employeePortalService.getMyProfile();
    const employeeId = await resolveEmployeeUuid(profile);
    if (!employeeId) return null;

    try {
      const response = await apiClient.get(`/dashboard/employee/${employeeId}`);
      const raw = unwrap<any>(response);
      const data = raw?.data ?? raw;

      if (!data || typeof data !== 'object') return null;
      if (!data.currentBooking || String(data.currentBooking).toLowerCase() === 'no booking') return null;
      return normalizeTrip({
        ...data,
        routeName: data.routeName || 'Assigned route',
        shuttleNumber: data.shuttleNumber || 'Unassigned',
        driverName: data.driverName || '',
        currentSpeedKmh: data.currentSpeedKmh ?? 0,
      });
    } catch {
      return null;
    }
  },

  getUpcomingBookings: async (): Promise<Booking[]> => {
    const profile = await employeePortalService.getMyProfile();
    const employeeId = await resolveEmployeeUuid(profile);

    if (!employeeId) {
      return [];
    }

    const response = await apiClient.get(`/bookings/employee/${employeeId}`);
    const raw = unwrap<any[]>(response) ?? [];
    const now = new Date();

    return sortBookingsByDateTime(
      raw
        .map(normalizeBooking)
        .filter((booking) => {
          const status = String(booking?.status ?? '').toUpperCase();
          if (['CANCELLED', 'COMPLETED', 'REJECTED', 'NO_SHOW'].includes(status)) {
            return false;
          }

          return !isBookingExpired(booking, now);
        }),
      true,
    );
  },

  getBookingHistory: async (): Promise<Booking[]> => {
    const profile = await employeePortalService.getMyProfile();
    const employeeId = await resolveEmployeeUuid(profile);

    if (!employeeId) {
      return [];
    }

    const response = await apiClient.get(`/bookings/employee/${employeeId}`);
    const raw = unwrap<any[]>(response) ?? [];
    const now = new Date();

    return sortBookingsByDateTime(
      raw
        .map(normalizeBooking)
        .filter((booking) => {
          const status = String(booking?.status ?? '').toUpperCase();
          return ['CANCELLED', 'COMPLETED', 'REJECTED', 'NO_SHOW'].includes(status) || isBookingExpired(booking, now);
        }),
      false,
    );
  },

  getCommuteAnalytics: async (): Promise<CommuteAnalytics> => {
    const profile = await employeePortalService.getMyProfile();
    const employeeId = await resolveEmployeeUuid(profile);
    if (!employeeId) {
      return {
        tripsThisMonth: 0,
        totalDistanceKm: 0,
        averageTravelTimeMinutes: 0,
        completedTrips: 0,
        cancelledTrips: 0,
        carbonSavedKg: 0,
        onTimeArrivalPercentage: 0,
      };
    }
    const response = await apiClient.get(`/dashboard/employee/${employeeId ?? profile.id ?? profile.employeeId ?? ''}`);
    const raw = unwrap<any>(response);
    const data = raw?.data ?? raw;

    if (!data || typeof data !== 'object') {
      return {
        tripsThisMonth: 0,
        totalDistanceKm: 0,
        averageTravelTimeMinutes: 0,
        completedTrips: 0,
        cancelledTrips: 0,
        carbonSavedKg: 0,
        onTimeArrivalPercentage: 0,
      };
    }

    return {
      tripsThisMonth: Number(data.tripsThisMonth ?? data.totalTripsMonth ?? 0),
      totalDistanceKm: Number(data.totalDistanceKm ?? 0),
      averageTravelTimeMinutes: Number(data.averageTravelTimeMinutes ?? data.averageTimeMins ?? 0),
      completedTrips: Number(data.completedTrips ?? 0),
      cancelledTrips: Number(data.cancelledTrips ?? 0),
      carbonSavedKg: Number(data.carbonSavedKg ?? 0),
      onTimeArrivalPercentage: Number(data.onTimeArrivalPercentage ?? 0),
    };
  },
};
