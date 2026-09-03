import apiClient from '../api/axios';

export const dashboardService = {
  getAdminMetrics: async () => apiClient.get('/admin/metrics'),
  getRidershipTrends: async (timeframe) => apiClient.get(`/admin/analytics/ridership?timeframe=${timeframe}`),
  getActiveAlerts: async () => apiClient.get('/admin/alerts'),
};

export const employeeService = {
  getProfile: async () => apiClient.get('/employee/profile'),
  getCommuteSchedule: async () => apiClient.get('/employee/commute-schedule'),
  updatePreferences: async (data) => apiClient.put('/employee/preferences', data),
};

export const driverService = {
  getAssignedTrips: async () => apiClient.get('/driver/trips'),
  startTrip: async (tripId) => apiClient.post(`/driver/trips/${tripId}/start`),
  completeTrip: async (tripId) => apiClient.post(`/driver/trips/${tripId}/complete`),
  verifyPassenger: async (passengerId) => apiClient.post('/driver/verify-passenger', { passengerId }),
};

export const bookingService = {
  getBookings: async () => apiClient.get('/bookings'),
  createBooking: async (bookingData) => apiClient.post('/bookings', bookingData),
  cancelBooking: async (bookingId) => apiClient.delete(`/bookings/${bookingId}`),
  getPassQr: async (bookingId) => apiClient.get(`/bookings/${bookingId}/qr`),
};

export const trackingService = {
  getLiveShuttleLocations: async () => apiClient.get('/tracking/shuttles'),
  getShuttleTelemetry: async (shuttleId) => apiClient.get(`/tracking/shuttles/${shuttleId}`),
  subscribeToStompSocket: (shuttleId, onMessage) => {
    console.log(`[WebSocket Mock] Subscribed to /topic/shuttle/${shuttleId}`);
    return () => console.log(`[WebSocket Mock] Unsubscribed from /topic/shuttle/${shuttleId}`);
  },
};

export const routeService = {
  getRoutes: async () => apiClient.get('/routes'),
  getRouteDetails: async (routeId) => apiClient.get(`/routes/${routeId}`),
  createRoute: async (routeData) => apiClient.post('/routes', routeData),
  updateRoute: async (routeId, routeData) => apiClient.put(`/routes/${routeId}`, routeData),
};

export const shuttleService = {
  getShuttles: async () => apiClient.get('/shuttles'),
  getShuttleById: async (id) => apiClient.get(`/shuttles/${id}`),
  updateMaintenanceStatus: async (id, status) => apiClient.patch(`/shuttles/${id}/status`, { status }),
};

export const notificationService = {
  getNotifications: async () => apiClient.get('/notifications'),
  markAsRead: async (id) => apiClient.patch(`/notifications/${id}/read`),
  clearAll: async () => apiClient.delete('/notifications'),
};
