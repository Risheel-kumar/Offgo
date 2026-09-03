import apiClient from '../api/axios';
import {
  ShuttleDetailItem,
  CreateShuttlePayload,
  UpdateShuttlePayload,
  ShuttleFilterOptions,
} from '../types';

const mapBackendShuttle = (shuttle: any): ShuttleDetailItem => {
  const totalSeats = Number(shuttle.totalSeats ?? shuttle.capacity ?? 0);
  const bookedSeats = Number(shuttle.bookedSeats ?? 0);
  const availableSeats = Number(shuttle.availableSeats ?? Math.max(0, totalSeats - bookedSeats));

  return {
    id: String(shuttle.id),
    vehicleNumber: shuttle.vehicleNumber,
    vehicleType: shuttle.vehicleType || 'VAN',
    manufacturer: shuttle.manufacturer || '',
    model: shuttle.vehicleName || '',
    capacity: totalSeats,
    totalSeats,
    availableSeats,
    bookedSeats,
    occupancy: bookedSeats,
    fuelType: shuttle.fuelType || '',
  fuelLevelPercent: Number(shuttle.fuelLevelPercent || 0),
  registrationNumber: shuttle.registrationNumber || shuttle.vehicleNumber,
  registrationDate: shuttle.registrationDate || '',
  status: shuttle.status || 'AVAILABLE',
  color: shuttle.color || '',
  maintenanceInfo: shuttle.maintenanceInfo,
  currentLocation: shuttle.currentLocation || { lat: 0, lng: 0, address: '' },
  lastUpdated: shuttle.lastUpdated || '',
  notes: shuttle.notes || '',
  assignedDriver: shuttle.driverId
    ? {
      id: String(shuttle.driverId),
      driverId: '',
      name: shuttle.driverName || '',
      phone: shuttle.driverPhone || '',
      email: shuttle.driverEmail || '',
    }
    : shuttle.assignedDriver,
    assignedRoute: shuttle.routeId
      ? { id: String(shuttle.routeId), code: '', name: shuttle.routeName || '', totalStops: 0 }
      : undefined,
  };
};

const unwrap = (response: any) => response.data?.data ?? response.data;

export const shuttleService = {
  getShuttles: async (filters?: ShuttleFilterOptions): Promise<ShuttleDetailItem[]> => {
    const response = await apiClient.get('/shuttles');
    let shuttles = (unwrap(response) as any[]).map(mapBackendShuttle);
    const query = filters?.searchQuery?.trim().toLowerCase();
    if (query) {
      shuttles = shuttles.filter((shuttle) =>
        [shuttle.vehicleNumber, shuttle.model, shuttle.manufacturer]
          .some((value) => value.toLowerCase().includes(query))
      );
    }
    return shuttles;
  },

  getShuttleById: async (id: string): Promise<ShuttleDetailItem> => {
    const response = await apiClient.get(`/shuttles/${id}`);
    return mapBackendShuttle(unwrap(response));
  },

  createShuttle: async (payload: CreateShuttlePayload): Promise<ShuttleDetailItem> => {
    const response = await apiClient.post('/shuttles', {
      vehicleNumber: payload.vehicleNumber,
      vehicleName: payload.model || payload.vehicleType,
      vehicleType: payload.vehicleType.toUpperCase().includes('BUS') ? 'BUS' : 'VAN',
      capacity: Number(payload.capacity),
      routeId: payload.assignedRouteId || undefined,
    });
    return mapBackendShuttle(unwrap(response));
  },

  updateShuttle: async (payload: UpdateShuttlePayload): Promise<ShuttleDetailItem> => {
    const response = await apiClient.put(`/shuttles/${payload.id}`, {
      vehicleNumber: payload.vehicleNumber,
      vehicleName: payload.model || payload.vehicleType,
      vehicleType: payload.vehicleType.toUpperCase().includes('BUS') ? 'BUS' : 'VAN',
      capacity: Number(payload.capacity),
      status: payload.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'ACTIVE',
      routeId: payload.assignedRouteId || undefined,
    });
    return mapBackendShuttle(unwrap(response));
  },

  updateStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'): Promise<ShuttleDetailItem> => {
    const response = await apiClient.patch(`/shuttles/${id}/status`, undefined, { params: { status } });
    return mapBackendShuttle(unwrap(response));
  },

  deleteShuttle: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/shuttles/${id}`);
    return true;
  },
};
