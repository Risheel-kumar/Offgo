import apiClient from '../api/axios';
import { RouteDetailItem, CreateRoutePayload, UpdateRoutePayload, RouteFilterOptions } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;

const mapRouteStop = (stop: any, index: number) => ({
  id: String(stop.stopId ?? stop.id ?? `route-stop-${index + 1}`),
  name: stop.stopName ?? stop.name ?? `Route Stop ${index + 1}`,
  address: stop.address ?? '',
  lat: Number(stop.latitude ?? stop.lat),
  lng: Number(stop.longitude ?? stop.lng),
  sequenceOrder: Number(stop.stopOrder ?? index + 1),
  scheduledTime: '',
  passengerBoardingCount: 0,
  passengerAlightingCount: 0,
});

const mapRoute = (route: any): RouteDetailItem => ({
  id: String(route.id),
  code: route.routeCode,
  name: route.routeName,
  description: route.description || '',
  startPoint: {
    name: route.source || 'Route source',
    address: route.source || 'Route source',
    lat: Number(route.startLat ?? route.sourceLat ?? 0),
    lng: Number(route.startLng ?? route.sourceLng ?? 0),
  },
  destination: {
    name: route.destination || 'Route destination',
    address: route.destination || 'Route destination',
    lat: Number(route.endLat ?? route.destinationLat ?? 0),
    lng: Number(route.endLng ?? route.destinationLng ?? 0),
  },
  totalStops: Number(route.totalStops || 0),
  stops: route.stops || [],
  totalDistanceKm: Number(route.distanceKm),
  estimatedDurationMinutes: Number(route.estimatedDurationMinutes),
  status: route.status || 'ACTIVE',
  createdDate: route.createdAt || '',
  dailyRidership: Number(route.dailyRidership || 0),
  assignedShuttle: route.assignedShuttle,
  assignedDriver: route.assignedDriver,
  driverId: route.driverId ? String(route.driverId) : undefined,
  driverName: route.driverName,
});

export const routeService = {
  getRoutes: async (filters?: RouteFilterOptions): Promise<RouteDetailItem[]> => {
    const response = await apiClient.get('/routes');
    let routes = await Promise.all((unwrap(response) as any[]).map(async (route) => {
      const mappedRoute = mapRoute(route);
      try {
        const stopsResponse = await apiClient.get(`/routes/${mappedRoute.id}/stops`);
        const stops = unwrap(stopsResponse);
        if (Array.isArray(stops)) {
          mappedRoute.stops = stops
            .map(mapRouteStop)
            .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
            .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
          mappedRoute.totalStops = mappedRoute.stops.length;
        }
      } catch {
        // Keep route metadata available when stop assignments are unavailable.
      }
      return mappedRoute;
    }));
    const query = filters?.searchQuery?.trim().toLowerCase();
    if (query) routes = routes.filter((route) => `${route.code} ${route.name}`.toLowerCase().includes(query));
    return routes;
  },

  getRouteById: async (id: string): Promise<RouteDetailItem> => {
    const response = await apiClient.get(`/routes/${id}`);
    return mapRoute(unwrap(response));
  },

  createRoute: async (payload: CreateRoutePayload & { code?: string }): Promise<RouteDetailItem> => {
    const response = await apiClient.post('/routes', {
      routeCode: payload.code || `RT-${Date.now()}`,
      routeName: payload.name,
      source: payload.startPoint.name,
      destination: payload.destination.name,
      distanceKm: Number(payload.totalDistanceKm),
      estimatedDurationMinutes: Number(payload.estimatedDurationMinutes),
      driverId: payload.driverId,
    });
    return mapRoute(unwrap(response));
  },

  updateRoute: async (payload: UpdateRoutePayload): Promise<RouteDetailItem> => {
    const response = await apiClient.put(`/routes/${payload.id}`, {
      routeCode: (payload as any).code,
      routeName: payload.name,
      source: payload.startPoint?.name,
      destination: payload.destination?.name,
      distanceKm: Number(payload.totalDistanceKm),
      estimatedDurationMinutes: Number(payload.estimatedDurationMinutes),
      status: payload.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      driverId: payload.driverId,
    });
    return mapRoute(unwrap(response));
  },

  deleteRoute: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/routes/${id}`);
    return true;
  },
};
