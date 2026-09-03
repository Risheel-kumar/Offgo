import apiClient from '../api/axios';
import { LiveTrackingVehicle, FleetSummaryMetrics } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;

const mapVehicle = (shuttle: any, telemetry?: any): LiveTrackingVehicle => ({
  id: String(shuttle.id),
  shuttleId: String(shuttle.id),
  vehicleNumber: shuttle.vehicleNumber,
  model: shuttle.vehicleName,
  driverId: telemetry?.driverId,
  driverName: telemetry?.driverName || 'Unassigned',
  driverPhone: telemetry?.driverPhone,
  routeId: telemetry?.routeId ? String(telemetry.routeId) : shuttle.routeId ? String(shuttle.routeId) : undefined,
  routeName: telemetry?.routeName || shuttle.routeName || 'Unassigned',
  routeCode: telemetry?.routeCode || shuttle.routeCode || 'N/A',
  status: shuttle.status === 'MAINTENANCE'
    ? 'MAINTENANCE'
    : telemetry?.trackingEnabled && telemetry?.shuttleStatus === 'ACTIVE' && shuttle.active !== false
      ? 'ACTIVE'
      : 'INACTIVE',
  speedKmH: Number(telemetry?.speed || 0),
  heading: Number(telemetry?.heading || 0),
  currentLocation: {
    lat: Number(telemetry?.latitude || 0),
    lng: Number(telemetry?.longitude || 0),
    address: telemetry?.currentStop || 'Location unavailable',
    updatedAt: telemetry?.updatedAt,
  },
  totalSeats: Number(shuttle.totalSeats ?? shuttle.capacity ?? 0),
  availableSeats: Number(shuttle.availableSeats ?? (Number(shuttle.totalSeats ?? shuttle.capacity ?? 0) - Number(shuttle.bookedSeats ?? 0))),
  bookedSeats: Number(shuttle.bookedSeats ?? 0),
  occupancyCount: Math.max(0, Number(shuttle.bookedSeats ?? shuttle.capacity ?? 0) - Number(shuttle.availableSeats ?? 0)),
  maxCapacity: Number(shuttle.totalSeats ?? shuttle.capacity ?? 0),
  occupancy: Math.max(0, Number(shuttle.bookedSeats ?? shuttle.capacity ?? 0) - Number(shuttle.availableSeats ?? 0)),
  capacity: Number(shuttle.totalSeats ?? shuttle.capacity ?? 0),
  lastUpdated: telemetry?.updatedAt ? new Date(telemetry.updatedAt).toLocaleTimeString() : 'No telemetry',
  departureTime: telemetry?.departureTime,
  arrivalTime: telemetry?.arrivalTime,
  scheduleStatus: telemetry?.scheduleStatus,
  trackingEnabled: telemetry?.trackingEnabled,
  isActive: telemetry?.shuttleActive,
});

const calculateMetrics = (vehicles: LiveTrackingVehicle[]): FleetSummaryMetrics => {
  const running = vehicles.filter((vehicle) => vehicle.trackingEnabled && vehicle.speedKmH > 0 && vehicle.isActive !== false).length;
  const maintenance = vehicles.filter((vehicle) => vehicle.status === 'MAINTENANCE').length;
  const idle = vehicles.filter((vehicle) => vehicle.isActive === false || vehicle.status === 'INACTIVE' || vehicle.status === 'AVAILABLE').length;
  const moving = vehicles.filter((vehicle) => vehicle.speedKmH > 0);
  return {
    totalVehicles: vehicles.length,
    totalFleet: vehicles.length,
    running,
    idle,
    maintenance,
    offline: 0,
    activeVehicles: running,
    inactiveVehicles: idle,
    delayedVehicles: vehicles.filter((vehicle) => vehicle.status === 'DELAYED').length,
    avgSpeedKmH: moving.length ? Math.round(moving.reduce((total, vehicle) => total + vehicle.speedKmH, 0) / moving.length) : 0,
    avgETAMinutes: 0,
  };
};

const loadFleet = async (): Promise<LiveTrackingVehicle[]> => {
  const [shuttleResponse, telemetryResponse] = await Promise.all([
    apiClient.get('/shuttles'),
    apiClient.get('/tracking/live'),
  ]);
  const shuttles = unwrap(shuttleResponse) as any[];
  const telemetry = unwrap(telemetryResponse) as any[];
  const telemetryByShuttle = new Map(telemetry.map((item) => [String(item.shuttleId), item]));
  return shuttles.map((shuttle) => mapVehicle(shuttle, telemetryByShuttle.get(String(shuttle.id))));
};

export const fleetService = {
  getFleetVehicles: loadFleet,
  getFleetMetrics: async (): Promise<FleetSummaryMetrics> => calculateMetrics(await loadFleet()),
};
