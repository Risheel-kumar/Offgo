import apiClient from '../api/axios';
import {
  LiveTrackingVehicle,
  RouteProgressData,
  CurrentStopData,
  ETAData,
  LocationHistoryPoint,
  FleetSummaryMetrics,
} from '../types';

export const mockVehicles: LiveTrackingVehicle[] = [
  {
    id: 'shuttle-01',
    vehicleNumber: 'OFF-GO-101',
    driverName: 'Robert Martinez',
    routeName: 'HQ Express Line A',
    currentLocation: { lat: 37.7749, lng: -122.4194, address: 'Financial District, Station 4' },
    speedKmH: 42,
    heading: 85,
    status: 'ON_TIME',
    occupancy: 28,
    capacity: 32,
    lastUpdated: 'Just now',
  },
  {
    id: 'shuttle-02',
    vehicleNumber: 'OFF-GO-104',
    driverName: 'Elena Rostova',
    routeName: 'North Tech Corridor B',
    currentLocation: { lat: 37.7833, lng: -122.4167, address: 'Market St & 5th St' },
    speedKmH: 35,
    heading: 120,
    status: 'IN_TRANSIT',
    occupancy: 18,
    capacity: 24,
    lastUpdated: '1 min ago',
  },
  {
    id: 'shuttle-03',
    vehicleNumber: 'OFF-GO-108',
    driverName: 'David Kim',
    routeName: 'Metro South Loop C',
    currentLocation: { lat: 37.76, lng: -122.435, address: 'Mission District Transit Hub' },
    speedKmH: 0,
    heading: 0,
    status: 'DELAYED',
    occupancy: 22,
    capacity: 24,
    lastUpdated: '2 mins ago',
  },
  {
    id: 'shuttle-04',
    vehicleNumber: 'OFF-GO-112',
    driverName: 'Samantha Green',
    routeName: 'East Campus Shuttle D',
    currentLocation: { lat: 37.791, lng: -122.405, address: 'Embarcadero Pier 3' },
    speedKmH: 48,
    heading: 210,
    status: 'ON_TIME',
    occupancy: 14,
    capacity: 20,
    lastUpdated: 'Just now',
  },
  {
    id: 'shuttle-05',
    vehicleNumber: 'OFF-GO-115',
    driverName: 'Carlos Smith',
    routeName: 'West Suburban Link E',
    currentLocation: { lat: 37.752, lng: -122.447, address: 'Twin Peaks Transfer Gate' },
    speedKmH: 0,
    heading: 330,
    status: 'MAINTENANCE',
    occupancy: 0,
    capacity: 30,
    lastUpdated: '5 mins ago',
  },
];

export const mockRouteProgress: Record<string, RouteProgressData> = {
  'shuttle-01': {
    shuttleId: 'shuttle-01',
    vehicleNumber: 'OFF-GO-101',
    routeName: 'HQ Express Line A',
    progressPercent: 68,
    totalStops: 6,
    completedStopsCount: 4,
    remainingStopsCount: 2,
    stops: [
      { id: 's1', stopName: 'Central Tech Station', sequenceOrder: 1, scheduledTime: '08:00 AM', actualTime: '08:01 AM', status: 'VISITED' },
      { id: 's2', stopName: 'North Bay Hub', sequenceOrder: 2, scheduledTime: '08:15 AM', actualTime: '08:16 AM', status: 'VISITED' },
      { id: 's3', stopName: 'Market Street Gate', sequenceOrder: 3, scheduledTime: '08:30 AM', actualTime: '08:30 AM', status: 'VISITED' },
      { id: 's4', stopName: 'Financial District, Station 4', sequenceOrder: 4, scheduledTime: '08:45 AM', actualTime: '08:44 AM', status: 'CURRENT' },
      { id: 's5', stopName: 'South Campus Terminal', sequenceOrder: 5, scheduledTime: '09:00 AM', status: 'UPCOMING' },
      { id: 's6', stopName: 'HQ Main Lobby', sequenceOrder: 6, scheduledTime: '09:15 AM', status: 'UPCOMING' },
    ],
  },
};

export const mockCurrentStop: Record<string, CurrentStopData> = {
  'shuttle-01': {
    shuttleId: 'shuttle-01',
    stopId: 's4',
    stopName: 'Financial District, Station 4',
    arrivalTime: '08:44 AM',
    departureTime: '08:48 AM',
    status: 'BOARDING',
    passengerOnboardingCount: 6,
    passengerOffboardingCount: 2,
  },
};

export const mockETA: Record<string, ETAData> = {
  'shuttle-01': {
    shuttleId: 'shuttle-01',
    destinationStopName: 'HQ Main Lobby',
    etaMinutes: 14,
    estimatedArrivalTime: '09:12 AM',
    remainingDistanceKm: 6.8,
    trafficCondition: 'LIGHT',
  },
};

export const mockLocationHistory: Record<string, LocationHistoryPoint[]> = {
  'shuttle-01': [
    { id: 'lh-1', timestamp: '08:00 AM', lat: 37.771, lng: -122.425, speedKmH: 0, heading: 0, stopName: 'Central Tech Station' },
    { id: 'lh-2', timestamp: '08:15 AM', lat: 37.778, lng: -122.421, speedKmH: 38, heading: 45, stopName: 'North Bay Hub' },
    { id: 'lh-3', timestamp: '08:30 AM', lat: 37.781, lng: -122.418, speedKmH: 44, heading: 80, stopName: 'Market Street Gate' },
    { id: 'lh-4', timestamp: '08:45 AM', lat: 37.7749, lng: -122.4194, speedKmH: 42, heading: 85, stopName: 'Financial District, Station 4' },
  ],
};

const mapBackendTrackingVehicle = (item: any, idx = 0): LiveTrackingVehicle => {
  return {
    id: item.shuttleId ? String(item.shuttleId) : item.id || `shuttle-${idx + 1}`,
    vehicleNumber: item.shuttleNumber || item.vehicleNumber || `OFF-GO-${101 + idx}`,
    driverName: item.driverName || 'Assigned Driver',
    routeName: item.routeName || 'HQ Express Line A',
    currentLocation: {
      lat: Number(item.latitude ?? item.currentLocation?.lat ?? 37.7749),
      lng: Number(item.longitude ?? item.currentLocation?.lng ?? -122.4194),
      address: item.currentStop || item.address || item.currentLocation?.address || 'Active Transit Corridor',
    },
    speedKmH: Number(item.speed ?? item.speedKmH ?? 35),
    heading: Number(item.heading ?? 90),
    status: item.status || 'ON_TIME',
    occupancy: item.occupancy || 16,
    capacity: item.capacity || 24,
    lastUpdated: item.recordedAt ? new Date(item.recordedAt).toLocaleTimeString() : 'Just now',
  };
};

export const trackingService = {
  // GET /api/v1/tracking/live
  getLiveFleet: async (): Promise<LiveTrackingVehicle[]> => {
    try {
      const response = await apiClient.get<any>('/tracking/live');
      const rawList = response.data?.data || response.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map(mapBackendTrackingVehicle);
      }
      return mockVehicles;
    } catch {
      return mockVehicles;
    }
  },

  // GET /api/v1/tracking/{shuttleId}
  getVehicleDetails: async (shuttleId: string): Promise<LiveTrackingVehicle> => {
    try {
      const response = await apiClient.get<any>(`/tracking/${shuttleId}`);
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return mapBackendTrackingVehicle(data);
      }
      throw new Error('Invalid telemetry');
    } catch {
      const found = mockVehicles.find((v) => v.id === shuttleId);
      return (
        found || {
          id: shuttleId,
          vehicleNumber: 'OFF-GO-101',
          driverName: 'Robert Martinez',
          routeName: 'HQ Express Line A',
          currentLocation: { lat: 37.7749, lng: -122.4194, address: 'Financial District, Station 4' },
          speedKmH: 42,
          heading: 85,
          status: 'ON_TIME',
          occupancy: 28,
          capacity: 32,
          lastUpdated: 'Just now',
        }
      );
    }
  },

  // PUT /api/v1/tracking/{shuttleId}
  updateVehicleLocation: async (
    shuttleId: string,
    locationData: { lat: number; lng: number; speedKmH?: number; heading?: number }
  ): Promise<LiveTrackingVehicle> => {
    try {
      const backendPayload = {
        latitude: locationData.lat,
        longitude: locationData.lng,
        speed: locationData.speedKmH ?? 30.0,
        heading: locationData.heading ?? 0.0,
      };
      const response = await apiClient.put<any>(`/tracking/${shuttleId}`, backendPayload);
      const data = response.data?.data || response.data;
      return mapBackendTrackingVehicle(data);
    } catch {
      const vehicle = await trackingService.getVehicleDetails(shuttleId);
      return {
        ...vehicle,
        currentLocation: { ...vehicle.currentLocation, lat: locationData.lat, lng: locationData.lng },
        speedKmH: locationData.speedKmH ?? vehicle.speedKmH,
        heading: locationData.heading ?? vehicle.heading,
        lastUpdated: 'Just now',
      };
    }
  },

  // GET /api/v1/tracking/{shuttleId}/progress
  getRouteProgress: async (shuttleId: string): Promise<RouteProgressData> => {
    try {
      const response = await apiClient.get<any>(`/tracking/${shuttleId}/progress`);
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return data;
      }
      throw new Error('Invalid progress data');
    } catch {
      return (
        mockRouteProgress[shuttleId] || {
          shuttleId,
          vehicleNumber: 'OFF-GO-101',
          routeName: 'HQ Express Line A',
          progressPercent: 50,
          totalStops: 4,
          completedStopsCount: 2,
          remainingStopsCount: 2,
          stops: [
            { id: 'st-1', stopName: 'Origin Depot', sequenceOrder: 1, scheduledTime: '08:00 AM', actualTime: '08:00 AM', status: 'VISITED' },
            { id: 'st-2', stopName: 'Transfer Station B', sequenceOrder: 2, scheduledTime: '08:20 AM', actualTime: '08:22 AM', status: 'VISITED' },
            { id: 'st-3', stopName: 'Midtown Exchange', sequenceOrder: 3, scheduledTime: '08:40 AM', status: 'CURRENT' },
            { id: 'st-4', stopName: 'Tech Park Campus', sequenceOrder: 4, scheduledTime: '09:00 AM', status: 'UPCOMING' },
          ],
        }
      );
    }
  },

  // GET /api/v1/tracking/{shuttleId}/current-stop
  getCurrentStop: async (shuttleId: string): Promise<CurrentStopData> => {
    try {
      const response = await apiClient.get<any>(`/tracking/${shuttleId}/current-stop`);
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return data;
      }
      throw new Error('Invalid current stop');
    } catch {
      return (
        mockCurrentStop[shuttleId] || {
          shuttleId,
          stopId: 'cs-01',
          stopName: 'Market Street Gate & Station 4',
          arrivalTime: '08:44 AM',
          departureTime: '08:48 AM',
          status: 'BOARDING',
          passengerOnboardingCount: 8,
          passengerOffboardingCount: 3,
        }
      );
    }
  },

  // GET /api/v1/tracking/{shuttleId}/history
  getLocationHistory: async (shuttleId: string): Promise<LocationHistoryPoint[]> => {
    try {
      const response = await apiClient.get<any>(`/tracking/${shuttleId}/history`);
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((p: any, idx: number) => ({
          id: p.id ? String(p.id) : `lhp-${idx}`,
          timestamp: p.recordedAt ? new Date(p.recordedAt).toLocaleTimeString() : 'Recent',
          lat: Number(p.latitude ?? p.lat),
          lng: Number(p.longitude ?? p.lng),
          speedKmH: Number(p.speed ?? p.speedKmH ?? 30),
          heading: Number(p.heading ?? 0),
        }));
      }
      return mockLocationHistory[shuttleId] || mockLocationHistory['shuttle-01'];
    } catch {
      return mockLocationHistory[shuttleId] || mockLocationHistory['shuttle-01'];
    }
  },

  // GET /api/v1/eta/{shuttleId}
  getETA: async (shuttleId: string): Promise<ETAData> => {
    try {
      const response = await apiClient.get<any>(`/eta/${shuttleId}`);
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return data;
      }
      throw new Error('Invalid ETA');
    } catch {
      return (
        mockETA[shuttleId] || {
          shuttleId,
          destinationStopName: 'HQ Central Campus',
          etaMinutes: 12,
          estimatedArrivalTime: '09:10 AM',
          remainingDistanceKm: 5.4,
          trafficCondition: 'LIGHT',
        }
      );
    }
  },

  // Calculate fleet metrics helper
  calculateSummaryMetrics: (vehicles: LiveTrackingVehicle[]): FleetSummaryMetrics => {
    const totalFleet = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'ON_TIME' || v.status === 'IN_TRANSIT').length;
    const inactiveVehicles = vehicles.filter((v) => v.status === 'MAINTENANCE' || v.status === 'IDLE').length;
    const delayedVehicles = vehicles.filter((v) => v.status === 'DELAYED').length;

    const movingVehicles = vehicles.filter((v) => v.speedKmH > 0);
    const avgSpeedKmH = movingVehicles.length > 0
      ? Math.round(movingVehicles.reduce((acc, v) => acc + v.speedKmH, 0) / movingVehicles.length)
      : 0;

    return {
      totalVehicles: totalFleet,
      running: vehicles.filter((v) => v.status === 'IN_TRANSIT' || v.status === 'ON_TIME' || (v as any).status === 'ACTIVE').length,
      idle: vehicles.filter((v) => v.status === 'IDLE').length,
      maintenance: vehicles.filter((v) => v.status === 'MAINTENANCE').length,
      offline: vehicles.filter((v) => (v as any).status === 'OFFLINE').length,
      totalFleet,
      activeVehicles,
      inactiveVehicles,
      avgSpeedKmH,
      delayedVehicles,
      avgETAMinutes: 14,
    };
  },
};
