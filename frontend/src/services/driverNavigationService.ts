import apiClient from '../api/axios';
import { getCurrentScheduleFromList, scheduleService } from './scheduleService';
import { routeService } from './routeService';
import { routeStopService } from './routeStopService';

export type DriverStopStatus = 'UPCOMING' | 'CURRENT' | 'COMPLETED' | 'SKIPPED';

export interface DriverNavigationStop {
  id: string;
  sequence: number;
  name: string;
  address: string;
  scheduledTime: string;
  estimatedArrivalMinutes: number;
  lat: number;
  lng: number;
  passengersWaiting: number;
  passengersBoarded: number;
  passengersDropped: number;
  status: DriverStopStatus;
  isOfficeDestination?: boolean;
}

export interface DriverTripNavigationState {
  tripId: string;
  shuttleId: string;
  tripCode: string;
  routeName: string;
  vehicleNumber: string;
  driverName: string;
  status: 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  currentLocation: {
    lat: number;
    lng: number;
    speedKmH: number;
    heading: number;
  };
  routeSource: {
    name: string;
    address: string;
  };
  officeDestination: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  stops: DriverNavigationStop[];
  activeStopIndex: number;
  passengerStats: {
    totalBookings: number;
    boarded: number;
    waiting: number;
    remaining: number;
  };
  progress: {
    completedStopsCount: number;
    totalStopsCount: number;
    distanceCoveredKm: number;
    remainingDistanceKm: number;
    estimatedOfficeArrival: string;
    percentage: number;
  };
  startTime?: string;
  endTime?: string;
}

const formatMinutesToClock = (totalMinutes: number) => {
  const safeMinutes = Number.isFinite(totalMinutes) ? Math.max(0, totalMinutes) : 0;
  const hours = Math.floor(safeMinutes / 60) % 24;
  const minutes = safeMinutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = ((hours + 11) % 12) + 1;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

const parseClockToMinutes = (value?: string) => {
  if (!value) return 0;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const amPm = (match[3] || '').toUpperCase();

  if (amPm === 'AM' && hours === 12) hours = 0;
  if (amPm === 'PM' && hours < 12) hours += 12;

  return hours * 60 + minutes;
};

const buildStopScheduleTime = (baseDepartureTime?: string, offsetMinutes: number, index: number) => {
  const departureMinutes = parseClockToMinutes(baseDepartureTime);
  const derivedMinutes = departureMinutes + Math.max(offsetMinutes || index * 15, 0);
  return formatMinutesToClock(derivedMinutes);
};

const INITIAL_MOCK_TRIP: DriverTripNavigationState = {
  tripId: 'TRIP-UNKNOWN',
  shuttleId: 'shuttle-unknown',
  tripCode: 'ROUTE-UNASSIGNED',
  routeName: 'Assigned route',
  vehicleNumber: 'Unassigned',
  driverName: 'Driver',
  status: 'SCHEDULED',
  currentLocation: {
    lat: 0,
    lng: 0,
    speedKmH: 0,
    heading: 0,
  },
  routeSource: {
    name: 'Current route start',
    address: 'Route start',
  },
  officeDestination: {
    name: 'Office destination',
    address: 'Office destination',
    lat: 0,
    lng: 0,
  },
  stops: [],
  activeStopIndex: 0,
  passengerStats: {
    totalBookings: 0,
    boarded: 0,
    waiting: 0,
    remaining: 0,
  },
  progress: {
    completedStopsCount: 0,
    totalStopsCount: 0,
    distanceCoveredKm: 0,
    remainingDistanceKm: 0,
    estimatedOfficeArrival: 'TBD',
    percentage: 0,
  },
};

let currentTripState: DriverTripNavigationState = JSON.parse(JSON.stringify(INITIAL_MOCK_TRIP));

const getDriverSchedules = async (driverId?: string) => {
  const schedules = await scheduleService.getSchedules();
  if (!driverId) return schedules;
  return schedules.filter((item) => item.driverId === driverId);
};

export const driverNavigationService = {
  /**
   * Fetch current driver active trip navigation state
   */
  async getCurrentTrip(driverId?: string): Promise<DriverTripNavigationState> {
    const schedules = await getDriverSchedules(driverId);
    const driverScopedSchedules = driverId ? schedules.filter((item) => item.driverId === driverId) : schedules;
    const currentSchedule = getCurrentScheduleFromList(driverScopedSchedules);
    const schedule = currentSchedule || driverScopedSchedules[0] || schedules[0] || null;
    if (!schedule) {
      currentTripState = JSON.parse(JSON.stringify(INITIAL_MOCK_TRIP));
      return currentTripState;
    }
    const route = await routeService.getRouteById(schedule.routeId);
    const routeStops = await routeStopService.getRouteStops(schedule.routeId);
    const stops: DriverNavigationStop[] = routeStops.map((stop, index) => ({
      id: String(stop.id || stop.stopId),
      sequence: Number(stop.sequenceOrder || index + 1),
      name: stop.name,
      address: stop.address || stop.landmark || stop.name,
      scheduledTime: stop.scheduledTime || buildStopScheduleTime(schedule.departureTime, Number(stop.estimatedArrivalMinutes || 0), index),
      estimatedArrivalMinutes: Number(stop.estimatedArrivalMinutes || (index + 1) * 10),
      lat: Number(stop.lat),
      lng: Number(stop.lng),
      passengersWaiting: Number(stop.passengerBoardingCount || stop.passengerBoardingCount === 0 ? stop.passengerBoardingCount : 0),
      passengersBoarded: 0,
      passengersDropped: Number(stop.passengerAlightingCount || 0),
      status: index === 0 ? 'CURRENT' : 'UPCOMING',
    }));
    const destination = { name: route.destination.name, address: route.destination.address, lat: route.destination.lat, lng: route.destination.lng };
    const totalPassengers = stops.reduce((sum, stop) => sum + stop.passengersWaiting, 0);
    const officeArrivalMinutes = Math.max(parseClockToMinutes(schedule.arrivalTime), parseClockToMinutes(schedule.departureTime) + Math.max(route.estimatedDurationMinutes || 0, 30));
    let currentLocation = { lat: 0, lng: 0, speedKmH: 0, heading: 0 };
    try {
      const locationResponse = await apiClient.get<any>(`/tracking/${schedule.shuttleId}`);
      const location = locationResponse.data?.data || locationResponse.data;
      if (location?.latitude != null && location?.longitude != null) {
        currentLocation = { lat: Number(location.latitude), lng: Number(location.longitude), speedKmH: Number(location.speed || 0), heading: Number(location.heading || 0) };
      }
    } catch {
      // Use the route origin until the shuttle has a persisted GPS point.
    }
    const sourceStop: DriverNavigationStop = {
      id: 'route-source',
      sequence: 0,
      name: route.startPoint.name,
      address: route.startPoint.address || route.startPoint.name,
      scheduledTime: schedule.departureTime || 'Departure',
      estimatedArrivalMinutes: 0,
      lat: route.startPoint.lat || stops[0]?.lat || currentLocation.lat,
      lng: route.startPoint.lng || stops[0]?.lng || currentLocation.lng,
      passengersWaiting: 0,
      passengersBoarded: 0,
      passengersDropped: 0,
      status: 'CURRENT',
    };

    const navigationStops = [
      sourceStop,
      ...stops.map((stop, index) => ({
        ...stop,
        sequence: index + 1,
        status: 'UPCOMING' as const,
        scheduledTime: stop.scheduledTime || buildStopScheduleTime(schedule.departureTime, Number(stop.estimatedArrivalMinutes || 0), index),
      })),
      {
        id: 'destination',
        sequence: stops.length + 1,
        name: destination.name,
        address: destination.address,
        scheduledTime: formatMinutesToClock(officeArrivalMinutes),
        estimatedArrivalMinutes: Math.max(route.estimatedDurationMinutes || 0, 0),
        lat: destination.lat,
        lng: destination.lng,
        passengersWaiting: 0,
        passengersBoarded: 0,
        passengersDropped: totalPassengers,
        status: 'UPCOMING' as const,
        isOfficeDestination: true,
      },
    ];

    const trip = {
      tripId: schedule.id,
      shuttleId: schedule.shuttleId,
      tripCode: schedule.code || schedule.id,
      routeName: schedule.routeName,
      vehicleNumber: schedule.shuttleNumber,
      driverName: schedule.driverName,
      status: schedule.trackingEnabled ? 'RUNNING' : 'SCHEDULED',
      currentLocation,
      routeSource: { name: route.startPoint.name, address: route.startPoint.address },
      officeDestination: destination,
      stops: navigationStops,
      activeStopIndex: 0,
      passengerStats: { totalBookings: totalPassengers, boarded: 0, waiting: totalPassengers, remaining: totalPassengers },
      progress: {
        completedStopsCount: 0,
        totalStopsCount: navigationStops.length,
        distanceCoveredKm: 0,
        remainingDistanceKm: route.totalDistanceKm,
        estimatedOfficeArrival: formatMinutesToClock(officeArrivalMinutes),
        percentage: 0,
      },
    };

    currentTripState = trip;
    return trip;
  },

  async getLatestLocation(shuttleId: string): Promise<DriverTripNavigationState['currentLocation']> {
    const response = await apiClient.get<any>(`/tracking/${shuttleId}`);
    const data = response.data?.data || response.data;
    return {
      lat: Number(data.latitude),
      lng: Number(data.longitude),
      speedKmH: Number(data.speed || 0),
      heading: Number(data.heading || 0),
    };
  },

  async publishLocation(
    shuttleId: string,
    location: DriverTripNavigationState['currentLocation']
  ): Promise<void> {
    try {
      await apiClient.put(`/tracking/${shuttleId}`, {
        latitude: location.lat,
        longitude: location.lng,
        speed: Math.max(0, location.speedKmH),
        heading: Math.min(360, Math.max(0, location.heading)),
      });
    } catch {
      currentTripState = {
        ...currentTripState,
        currentLocation: {
          ...currentTripState.currentLocation,
          lat: location.lat,
          lng: location.lng,
          speedKmH: location.speedKmH,
          heading: location.heading,
        },
      };
    }
  },

  /**
   * Start driver shift and initialize navigation
   */
  async startShift(driverId?: string): Promise<DriverTripNavigationState> {
    try {
      if (driverId) {
        await apiClient.post(`/drivers/${driverId}/navigation/start`);
      }
    } catch {
      // Backend navigation endpoint is not always available; continue with synced local trip state.
    }
    currentTripState = await this.getCurrentTrip(driverId);
    currentTripState.status = 'RUNNING';
    return currentTripState;
  },

  /**
   * Complete current stop and auto-advance to next stop or office destination
   */
  async markStopCompleted(stopId: string): Promise<DriverTripNavigationState> {
    const trip = { ...currentTripState };
    const stopIndex = trip.stops.findIndex((stop) => stop.id === stopId);
    if (stopIndex < 0) return trip;

    const updatedStops = trip.stops.map((stop, index) => {
      if (index !== stopIndex) return stop;
      return { ...stop, status: 'COMPLETED' as const };
    });

    const nextIndex = Math.min(stopIndex + 1, updatedStops.length - 1);
    if (nextIndex >= 0 && updatedStops[nextIndex]) {
      updatedStops[nextIndex] = { ...updatedStops[nextIndex], status: 'CURRENT' };
    }

    const completedCount = updatedStops.filter((stop) => stop.status === 'COMPLETED').length;
    currentTripState = {
      ...trip,
      stops: updatedStops,
      activeStopIndex: nextIndex,
      progress: {
        ...trip.progress,
        completedStopsCount: completedCount,
        percentage: Math.round((completedCount / Math.max(updatedStops.length, 1)) * 100),
      },
    };

    return currentTripState;
  },

  /**
   * Pause driver trip
   */
  async pauseTrip(): Promise<DriverTripNavigationState> {
    currentTripState = { ...currentTripState, status: 'PAUSED' };
    return currentTripState;
  },

  /**
   * Resume driver trip
   */
  async resumeTrip(): Promise<DriverTripNavigationState> {
    currentTripState = { ...currentTripState, status: 'RUNNING' };
    return currentTripState;
  },

  /**
   * End trip prematurely or on office arrival
   */
  async endTrip(driverId?: string): Promise<DriverTripNavigationState> {
    try {
      if (driverId) {
        await apiClient.post(`/drivers/${driverId}/navigation/stop`);
      }
    } catch {
      // Ignore missing backend endpoint and keep the local telemetry state consistent.
    }

    currentTripState = {
      ...currentTripState,
      status: 'COMPLETED',
      progress: { ...currentTripState.progress, percentage: 100 },
      activeStopIndex: Math.max(0, currentTripState.stops.length - 1),
    };
    return currentTripState;
  },

  /**
   * Reset driver trip to initial state for testing
   */
  async resetTrip(): Promise<DriverTripNavigationState> {
    currentTripState = JSON.parse(JSON.stringify(INITIAL_MOCK_TRIP));
    return currentTripState;
  },
};
