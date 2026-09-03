import apiClient from '../api/axios';
import {
  LiveTripItem,
  TripHistoryItem,
  TripStopItem,
  TripFilterOptions,
  PassengerBoardingStatus,
} from '../types';

let mockLiveTripsState: LiveTripItem[] = [
  {
    id: 'trp-1001',
    code: 'TRIP-OFF-901',
    routeId: 'rt-101',
    routeName: 'HQ Financial District Express Line A',
    shuttleId: 'sht-1',
    shuttleNumber: 'OFF-GO-101',
    driverId: 'drv-1',
    driverName: 'David Miller',
    driverPhone: '+1 (555) 234-5678',
    lat: 37.7885,
    lng: -122.3998,
    heading: 210,
    currentSpeedKmh: 38,
    status: 'IN_TRANSIT',
    distanceRemainingKm: 4.2,
    etaMinutes: 12,
    delayMinutes: 2,
    startTime: '07:30 AM',
    currentStop: {
      id: 'stp-102',
      name: 'Montgomery BART Transit Gate',
      lat: 37.7891,
      lng: -122.4014,
      estimatedArrival: '07:42 AM',
      actualArrival: '07:43 AM',
      isCompleted: true,
      isCurrent: false,
    },
    nextStop: {
      id: 'stp-103',
      name: 'SOMA Tech Plaza Stop',
      lat: 37.7812,
      lng: -122.398,
      estimatedArrival: '07:55 AM',
      isCompleted: false,
      isCurrent: true,
    },
    stops: [
      {
        id: 'stp-101',
        name: 'Financial District Terminal',
        lat: 37.795,
        lng: -122.398,
        estimatedArrival: '07:30 AM',
        actualArrival: '07:30 AM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: 'stp-102',
        name: 'Montgomery BART Transit Gate',
        lat: 37.7891,
        lng: -122.4014,
        estimatedArrival: '07:42 AM',
        actualArrival: '07:43 AM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: 'stp-103',
        name: 'SOMA Tech Plaza Stop',
        lat: 37.7812,
        lng: -122.398,
        estimatedArrival: '07:55 AM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: 'stp-105',
        name: 'Off-Go Innovation HQ',
        lat: 37.7749,
        lng: -122.4194,
        estimatedArrival: '08:25 AM',
        isCompleted: false,
        isCurrent: false,
      },
    ],
    passengers: [
      {
        id: 'p-1',
        bookingCode: 'OFF-BKG-88301',
        employeeId: 'EMP-101',
        employeeName: 'Alexander Wright',
        employeeEmail: 'alexander.wright@company.com',
        pickupStopName: 'Financial District Terminal',
        dropStopName: 'Off-Go Innovation HQ',
        bookingStatus: 'CONFIRMED',
        boardingStatus: 'BOARDED',
      },
      {
        id: 'p-2',
        bookingCode: 'OFF-BKG-88302',
        employeeId: 'EMP-102',
        employeeName: 'Sophia Rodriguez',
        employeeEmail: 'sophia.rodriguez@company.com',
        pickupStopName: 'Montgomery BART Transit Gate',
        dropStopName: 'Off-Go Innovation HQ',
        bookingStatus: 'CONFIRMED',
        boardingStatus: 'BOARDED',
      },
      {
        id: 'p-3',
        bookingCode: 'OFF-BKG-88306',
        employeeId: 'EMP-106',
        employeeName: 'Rachel Kim',
        employeeEmail: 'rachel.kim@company.com',
        pickupStopName: 'SOMA Tech Plaza Stop',
        dropStopName: 'Off-Go Innovation HQ',
        bookingStatus: 'CONFIRMED',
        boardingStatus: 'WAITING',
      },
    ],
  },
  {
    id: 'trp-1002',
    code: 'TRIP-OFF-902',
    routeId: 'rt-102',
    routeName: 'North Tech Corridor Loop B',
    shuttleId: 'sht-3',
    shuttleNumber: 'OFF-GO-104',
    driverId: 'drv-3',
    driverName: 'Robert Thorne',
    driverPhone: '+1 (555) 876-5432',
    lat: 37.8021,
    lng: -122.4351,
    heading: 140,
    currentSpeedKmh: 45,
    status: 'AT_STOP',
    distanceRemainingKm: 6.8,
    etaMinutes: 18,
    delayMinutes: 0,
    startTime: '08:00 AM',
    currentStop: {
      id: 'stp-106',
      name: 'Marina North Station',
      lat: 37.8021,
      lng: -122.4351,
      estimatedArrival: '08:00 AM',
      actualArrival: '08:01 AM',
      isCompleted: false,
      isCurrent: true,
    },
    nextStop: {
      id: 'stp-105',
      name: 'Off-Go Innovation HQ',
      lat: 37.7749,
      lng: -122.4194,
      estimatedArrival: '08:35 AM',
      isCompleted: false,
      isCurrent: false,
    },
    stops: [
      {
        id: 'stp-106',
        name: 'Marina North Station',
        lat: 37.8021,
        lng: -122.4351,
        estimatedArrival: '08:00 AM',
        actualArrival: '08:01 AM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: 'stp-105',
        name: 'Off-Go Innovation HQ',
        lat: 37.7749,
        lng: -122.4194,
        estimatedArrival: '08:35 AM',
        isCompleted: false,
        isCurrent: false,
      },
    ],
    passengers: [
      {
        id: 'p-4',
        bookingCode: 'OFF-BKG-88303',
        employeeId: 'EMP-103',
        employeeName: 'Marcus Vance',
        employeeEmail: 'marcus.vance@company.com',
        pickupStopName: 'Marina North Station',
        dropStopName: 'Off-Go Innovation HQ',
        bookingStatus: 'CONFIRMED',
        boardingStatus: 'BOARDED',
      },
    ],
  },
  {
    id: 'trp-1003',
    code: 'TRIP-OFF-903',
    routeId: 'rt-104',
    routeName: 'West Suburbs Executive Connector',
    shuttleId: 'sht-4',
    shuttleNumber: 'OFF-GO-108',
    driverId: 'drv-4',
    driverName: 'Elena Rostova',
    driverPhone: '+1 (555) 345-6789',
    lat: 37.7512,
    lng: -122.4511,
    heading: 90,
    currentSpeedKmh: 0,
    status: 'SCHEDULED',
    distanceRemainingKm: 12.5,
    etaMinutes: 30,
    delayMinutes: 0,
    startTime: '05:15 PM',
    currentStop: {
      id: 'stp-107',
      name: 'West Park Commuter Garage',
      lat: 37.7512,
      lng: -122.4511,
      estimatedArrival: '05:15 PM',
      isCompleted: false,
      isCurrent: true,
    },
    nextStop: {
      id: 'stp-105',
      name: 'Off-Go Innovation HQ',
      lat: 37.7749,
      lng: -122.4194,
      estimatedArrival: '06:10 PM',
      isCompleted: false,
      isCurrent: false,
    },
    stops: [
      {
        id: 'stp-107',
        name: 'West Park Commuter Garage',
        lat: 37.7512,
        lng: -122.4511,
        estimatedArrival: '05:15 PM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: 'stp-105',
        name: 'Off-Go Innovation HQ',
        lat: 37.7749,
        lng: -122.4194,
        estimatedArrival: '06:10 PM',
        isCompleted: false,
        isCurrent: false,
      },
    ],
    passengers: [
      {
        id: 'p-5',
        bookingCode: 'OFF-BKG-88304',
        employeeId: 'EMP-104',
        employeeName: 'Elena Rostova',
        employeeEmail: 'elena.rostova@company.com',
        pickupStopName: 'West Park Commuter Garage',
        dropStopName: 'Off-Go Innovation HQ',
        bookingStatus: 'PENDING',
        boardingStatus: 'WAITING',
      },
    ],
  },
];

const mockTripHistoryState: TripHistoryItem[] = [
  {
    id: 'his-1',
    code: 'TRIP-OFF-880',
    routeName: 'HQ Financial District Express Line A',
    shuttleNumber: 'OFF-GO-101',
    driverName: 'David Miller',
    date: '2026-07-21',
    distanceKm: 18.5,
    durationMinutes: 45,
    totalPassengers: 22,
    status: 'COMPLETED',
  },
  {
    id: 'his-2',
    code: 'TRIP-OFF-881',
    routeName: 'North Tech Corridor Loop B',
    shuttleNumber: 'OFF-GO-104',
    driverName: 'Robert Thorne',
    date: '2026-07-21',
    distanceKm: 14.2,
    durationMinutes: 38,
    totalPassengers: 16,
    status: 'COMPLETED',
  },
  {
    id: 'his-3',
    code: 'TRIP-OFF-882',
    routeName: 'East Bay BART Shuttle Link',
    shuttleNumber: 'OFF-GO-112',
    driverName: 'Marcus Vance',
    date: '2026-07-20',
    distanceKm: 26.0,
    durationMinutes: 52,
    totalPassengers: 28,
    status: 'COMPLETED',
  },
];

export const tripService = {
  /**
   * GET /api/v1/tracking/live
   */
  getLiveTrips: async (filters?: TripFilterOptions): Promise<LiveTripItem[]> => {
    try {
      const response = await apiClient.get<LiveTripItem[]>('/tracking/live', { params: filters });
      return response.data;
    } catch {
      let results = [...mockLiveTripsState];

      if (filters) {
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (t) =>
              t.code.toLowerCase().includes(q) ||
              t.routeName.toLowerCase().includes(q) ||
              t.shuttleNumber.toLowerCase().includes(q) ||
              t.driverName.toLowerCase().includes(q)
          );
        }

        if (filters.statusFilter && filters.statusFilter !== 'ALL') {
          results = results.filter((t) => t.status === filters.statusFilter);
        }

        if (filters.routeFilter && filters.routeFilter !== 'ALL') {
          results = results.filter((t) => t.routeId === filters.routeFilter);
        }

        if (filters.vehicleFilter && filters.vehicleFilter !== 'ALL') {
          results = results.filter((t) => t.shuttleId === filters.vehicleFilter);
        }
      }

      return results;
    }
  },

  /**
   * GET /api/v1/tracking/{shuttleId}
   */
  getTripByShuttleId: async (shuttleId: string): Promise<LiveTripItem> => {
    try {
      const response = await apiClient.get<LiveTripItem>(`/tracking/${shuttleId}`);
      return response.data;
    } catch {
      const found = mockLiveTripsState.find((t) => t.shuttleId === shuttleId || t.id === shuttleId);
      if (!found) {
        return mockLiveTripsState[0];
      }
      return found;
    }
  },

  /**
   * GET /api/v1/tracking/{shuttleId}/progress
   */
  getTripProgress: async (shuttleId: string) => {
    try {
      const response = await apiClient.get(`/tracking/${shuttleId}/progress`);
      return response.data;
    } catch {
      const trip = mockLiveTripsState.find((t) => t.shuttleId === shuttleId || t.id === shuttleId) || mockLiveTripsState[0];
      return {
        shuttleId,
        distanceRemainingKm: trip.distanceRemainingKm,
        etaMinutes: trip.etaMinutes,
        currentSpeedKmh: trip.currentSpeedKmh,
        stopsCompleted: trip.stops.filter((s) => s.isCompleted).length,
        totalStops: trip.stops.length,
      };
    }
  },

  /**
   * GET /api/v1/tracking/{shuttleId}/current-stop
   */
  getCurrentStop: async (shuttleId: string): Promise<TripStopItem> => {
    try {
      const response = await apiClient.get<TripStopItem>(`/tracking/${shuttleId}/current-stop`);
      return response.data;
    } catch {
      const trip = mockLiveTripsState.find((t) => t.shuttleId === shuttleId || t.id === shuttleId) || mockLiveTripsState[0];
      return trip.currentStop;
    }
  },

  /**
   * GET /api/v1/eta/{shuttleId}
   */
  getETA: async (shuttleId: string) => {
    try {
      const response = await apiClient.get(`/eta/${shuttleId}`);
      return response.data;
    } catch {
      const trip = mockLiveTripsState.find((t) => t.shuttleId === shuttleId || t.id === shuttleId) || mockLiveTripsState[0];
      return {
        shuttleId,
        etaMinutes: trip.etaMinutes,
        delayMinutes: trip.delayMinutes,
        nextStopName: trip.nextStop.name,
        estimatedArrivalNextStop: trip.nextStop.estimatedArrival,
        trafficStatus: trip.delayMinutes > 0 ? 'Moderate Congestion (+2 mins)' : 'Clear Traffic',
      };
    }
  },

  /**
   * GET /api/v1/tracking/{shuttleId}/history
   */
  getTripHistory: async (shuttleId?: string): Promise<TripHistoryItem[]> => {
    try {
      const response = await apiClient.get<TripHistoryItem[]>(`/tracking/${shuttleId || 'all'}/history`);
      return response.data;
    } catch {
      return mockTripHistoryState;
    }
  },

  /**
   * Update passenger boarding status (e.g. Waiting -> Boarded -> Dropped -> No Show)
   */
  updatePassengerBoardingStatus: async (
    tripId: string,
    passengerId: string,
    boardingStatus: PassengerBoardingStatus
  ): Promise<boolean> => {
    try {
      await apiClient.put(`/tracking/trips/${tripId}/passengers/${passengerId}/status`, { boardingStatus });
      return true;
    } catch {
      const tripIdx = mockLiveTripsState.findIndex((t) => t.id === tripId);
      if (tripIdx !== -1) {
        const passIdx = mockLiveTripsState[tripIdx].passengers.findIndex((p) => p.id === passengerId);
        if (passIdx !== -1) {
          mockLiveTripsState[tripIdx].passengers[passIdx].boardingStatus = boardingStatus;
        }
      }
      return true;
    }
  },
};
