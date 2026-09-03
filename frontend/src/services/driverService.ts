import apiClient from '../api/axios';
import { Driver, CreateDriverPayload, DriverFilterOptions, DriverAssignedShuttle, DriverAssignedRoute } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;
const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
};
const toCreateRequest = (payload: CreateDriverPayload) => ({
  employeeId: payload.driverId.trim(),
  firstName: payload.firstName.trim(),
  lastName: payload.lastName.trim(),
  email: payload.email.trim(),
  phoneNumber: normalizePhone(payload.phone),
  licenseNumber: payload.licenseNumber.trim(),
  licenseExpiry: payload.licenseExpiry,
  experience: Number(payload.experienceYears),
  password: payload.password,
  confirmPassword: payload.confirmPassword,
});
const mapDriver = (driver: any): Driver => ({
  id: String(driver.id),
  driverId: driver.employeeId || '',
  firstName: driver.firstName || '',
  lastName: driver.lastName || '',
  name: `${driver.firstName || ''} ${driver.lastName || ''}`.trim(),
  email: driver.email || '',
  phone: driver.phoneNumber || '',
  licenseNumber: driver.licenseNumber || '',
  licenseExpiry: String(driver.licenseExpiry || ''),
  experienceYears: Number(driver.experience || 0),
  status: driver.active === false ? 'INACTIVE' : driver.status || 'ACTIVE',
  availability: 'OFF_DUTY',
  createdAt: driver.createdAt || '',
  assignedShuttle: driver.shuttleId ? { shuttleId: String(driver.shuttleId), vehicleNumber: driver.shuttleNumber || '', model: '', capacity: 0 } : undefined,
});

export const driverService = {
  getDrivers: async (filters?: DriverFilterOptions): Promise<Driver[]> => {
    const response = await apiClient.get('/drivers');
    let drivers = (unwrap(response) as any[]).filter((driver) => driver.active !== false).map(mapDriver);
    const query = filters?.searchQuery?.trim().toLowerCase();
    if (query) drivers = drivers.filter((driver) => `${driver.name} ${driver.driverId} ${driver.licenseNumber}`.toLowerCase().includes(query));
    return drivers;
  },
  getDriverById: async (id: string): Promise<Driver> => mapDriver(unwrap(await apiClient.get(`/drivers/${id}`))),
  createDriver: async (payload: CreateDriverPayload): Promise<Driver> => {
    const response = await apiClient.post('/drivers', toCreateRequest(payload));
    return mapDriver(unwrap(response));
  },
  updateDriver: async (id: string, payload: CreateDriverPayload): Promise<Driver> => {
    const response = await apiClient.put(`/drivers/${id}`, toCreateRequest(payload));
    return mapDriver(unwrap(response));
  },
  updateDriverAssignment: async (id: string, shuttle?: DriverAssignedShuttle | null, _route?: DriverAssignedRoute | null): Promise<Driver> => {
    const response = await apiClient.patch(`/drivers/${id}/assignment`, undefined, { params: { shuttleId: shuttle?.shuttleId || undefined } });
    return mapDriver(unwrap(response));
  },
  deleteDriver: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/drivers/${id}`);
    return true;
  },
};
