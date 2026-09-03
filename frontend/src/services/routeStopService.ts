import apiClient from '../api/axios';
import { AssignedRouteStop, AssignStopToRoutePayload, ReorderRouteStopsPayload } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;

const mapRouteStop = (stop: any, index = 0): AssignedRouteStop => ({
  id: String(stop.id),
  stopId: String(stop.stopId || stop.id),
  code: stop.stopCode || stop.code || '',
  name: stop.stopName || stop.name || '',
  address: stop.address || '',
  lat: Number(stop.latitude ?? stop.lat ?? 0),
  lng: Number(stop.longitude ?? stop.lng ?? 0),
  landmark: stop.landmark || '',
  city: stop.city || '',
  zone: stop.zone || '',
  sequenceOrder: Number(stop.stopOrder ?? stop.sequenceOrder ?? index + 1),
  estimatedArrivalMinutes: Number(stop.estimatedArrivalOffsetMinutes ?? stop.estimatedTimeMinutes ?? 0),
  travelTimeFromPrevMinutes: 0,
  distanceFromPrevKm: Number(stop.distanceFromSourceKm ?? 0),
  status: stop.status || 'ACTIVE',
  passengerBoardingCount: Number(stop.passengerBoardingCount || 0),
  passengerAlightingCount: Number(stop.passengerAlightingCount || 0),
  scheduledTime: stop.scheduledTime,
});

export const routeStopService = {
  getRouteStops: async (routeId: string): Promise<AssignedRouteStop[]> => {
    const response = await apiClient.get(`/routes/${routeId}/stops`);
    return (unwrap(response) as any[]).map(mapRouteStop);
  },

  assignStopToRoute: async (payload: AssignStopToRoutePayload): Promise<AssignedRouteStop> => {
    const response = await apiClient.post(`/routes/${payload.routeId}/stops`, {
      stopId: payload.stopId,
      stopOrder: payload.sequenceOrder || 1,
      estimatedArrivalOffsetMinutes: payload.estimatedArrivalMinutes || 0,
    });
    return mapRouteStop(unwrap(response));
  },

  reorderRouteStops: async (payload: ReorderRouteStopsPayload): Promise<AssignedRouteStop[]> => {
    const response = await apiClient.put(`/routes/${payload.routeId}/stops/reorder`, payload);
    return (unwrap(response) as any[]).map(mapRouteStop);
  },

  removeStopFromRoute: async (routeId: string, stopId: string): Promise<boolean> => {
    await apiClient.delete(`/routes/${routeId}/stops/${stopId}`);
    return true;
  },
};
