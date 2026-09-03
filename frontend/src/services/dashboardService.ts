import apiClient from '../api/axios';
import { AdminDashboardData, LiveTrackingVehicle, AppNotification, ActivityLogItem } from '../types';

export const mockAdminDashboardData: AdminDashboardData = {
  metrics: {
    totalEmployees: 1284,
    totalDrivers: 42,
    totalShuttles: 36,
    totalRoutes: 18,
    totalSchedules: 124,
    totalBookings: 892,
    totalAttendance: 846,
    attendanceRatePercent: 94.8,
    activeShuttles: 28,
    onTimePercentage: 96.2,
    totalDailyPassengers: 1420,
    co2SavedKg: 3180,
    avgOccupancyRatePercent: 82.5,
  },
  bookingTrend: [
    { date: 'Mon', bookings: 640, completed: 620, cancelled: 20 },
    { date: 'Tue', bookings: 780, completed: 750, cancelled: 30 },
    { date: 'Wed', bookings: 892, completed: 860, cancelled: 32 },
    { date: 'Thu', bookings: 810, completed: 785, cancelled: 25 },
    { date: 'Fri', bookings: 950, completed: 910, cancelled: 40 },
    { date: 'Sat', bookings: 320, completed: 310, cancelled: 10 },
    { date: 'Sun', bookings: 210, completed: 205, cancelled: 5 },
  ],
  attendanceTrend: [
    { day: 'Mon', present: 810, absent: 40, rate: 95.3 },
    { day: 'Tue', present: 835, absent: 35, rate: 96.0 },
    { day: 'Wed', present: 846, absent: 30, rate: 96.6 },
    { day: 'Thu', present: 820, absent: 42, rate: 95.1 },
    { day: 'Fri', present: 790, absent: 55, rate: 93.5 },
  ],
  fleetUsage: [
    { name: 'EV Buses', inService: 16, maintenance: 2, idle: 2 },
    { name: 'Sprinter Vans', inService: 10, maintenance: 1, idle: 3 },
    { name: 'Luxury Coaches', inService: 2, maintenance: 0, idle: 0 },
  ],
  routeDistribution: [
    { routeName: 'HQ Express Line A', passengers: 420, color: '#6366f1' },
    { routeName: 'North Tech Corridor B', passengers: 310, color: '#3b82f6' },
    { routeName: 'Metro South Loop C', passengers: 280, color: '#10b981' },
    { routeName: 'East Campus Shuttle D', passengers: 240, color: '#f59e0b' },
    { routeName: 'West Suburban Link E', passengers: 170, color: '#8b5cf6' },
  ],
  monthlyActivity: [
    { month: 'Jan', trips: 1120, passengers: 21400, efficiency: 92 },
    { month: 'Feb', trips: 1240, passengers: 23800, efficiency: 94 },
    { month: 'Mar', trips: 1380, passengers: 26500, efficiency: 95 },
    { month: 'Apr', trips: 1410, passengers: 27900, efficiency: 96 },
    { month: 'May', trips: 1520, passengers: 29800, efficiency: 97 },
    { month: 'Jun', trips: 1680, passengers: 32400, efficiency: 96.5 },
  ],
  liveTracking: [
    {
      id: 'shuttle-01',
      vehicleNumber: 'OFF-GO-101',
      driverName: 'Robert Martinez',
      routeName: 'HQ Express Line A',
      currentLocation: { lat: 37.7749, lng: -122.4194, address: 'Financial District, Station 4' },
      speedKmH: 42,
      heading: 85,
      status: 'ON_TIME',
      totalSeats: 32,
      availableSeats: 32,
      bookedSeats: 0,
      occupancy: 0,
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
      totalSeats: 24,
      availableSeats: 24,
      bookedSeats: 0,
      occupancy: 0,
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
      totalSeats: 24,
      availableSeats: 24,
      bookedSeats: 0,
      occupancy: 0,
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
      totalSeats: 20,
      availableSeats: 20,
      bookedSeats: 0,
      occupancy: 0,
      capacity: 20,
      lastUpdated: 'Just now',
    },
    {
      id: 'shuttle-05',
      vehicleNumber: 'OFF-GO-115',
      driverName: 'Carlos Smith',
      routeName: 'West Suburban Link E',
      currentLocation: { lat: 37.752, lng: -122.447, address: 'Twin Peaks Transfer Gate' },
      speedKmH: 28,
      heading: 330,
      status: 'MAINTENANCE',
      totalSeats: 30,
      availableSeats: 30,
      bookedSeats: 0,
      occupancy: 0,
      capacity: 30,
      lastUpdated: '5 mins ago',
    },
  ],
  recentActivities: [
    {
      id: 'act-01',
      type: 'BOOKING_CREATED',
      title: 'New VIP Booking Reserved',
      description: 'Sarah Jenkins reserved seat 12B on HQ Express Line A.',
      timestamp: '5 mins ago',
      user: 'Sarah Jenkins',
      status: 'CONFIRMED',
    },
    {
      id: 'act-02',
      type: 'DRIVER_ASSIGNED',
      title: 'Driver Shift Assigned',
      description: 'Michael Vance assigned to Shuttle OFF-GO-108 for Evening Route.',
      timestamp: '18 mins ago',
      user: 'Admin Alex',
      status: 'ACTIVE',
    },
    {
      id: 'act-03',
      type: 'EMPLOYEE_ADDED',
      title: 'New Employee Onboarded',
      description: 'David Chen (Engineering) added to Corporate Transit system.',
      timestamp: '42 mins ago',
      user: 'HR Ops',
      status: 'COMPLETED',
    },
    {
      id: 'act-04',
      type: 'ROUTE_UPDATED',
      title: 'Route Stop Modified',
      description: 'Added temporary detour stop on Metro South Loop C due to roadwork.',
      timestamp: '1 hour ago',
      user: 'Admin Alex',
      status: 'UPDATED',
    },
    {
      id: 'act-05',
      type: 'SHUTTLE_DISPATCHED',
      title: 'Fleet Shuttle Dispatched',
      description: 'Shuttle OFF-GO-101 departed Central Station right on time.',
      timestamp: '2 hours ago',
      user: 'Dispatcher System',
      status: 'IN_TRANSIT',
    },
  ],
  notifications: [
    {
      id: 'notif-01',
      title: 'High Traffic Alert',
      message: 'Heavy congestion reported on Route B near Tech Park. +10 mins delay expected.',
      type: 'WARNING',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-02',
      title: '98% Capacity Reached',
      message: 'HQ Express Morning Peak schedule is almost fully booked.',
      type: 'INFO',
      timestamp: '25 mins ago',
      read: false,
    },
    {
      id: 'notif-03',
      title: 'Scheduled Maintenance Complete',
      message: 'Shuttle OFF-GO-102 inspection completed successfully. Ready for service.',
      type: 'SUCCESS',
      timestamp: '1 hour ago',
      read: true,
    },
  ],
};

export const dashboardService = {
  getAdminDashboardData: async (): Promise<AdminDashboardData> => {
    try {
      const response = await apiClient.get<any>('/dashboard/admin');
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return {
          ...mockAdminDashboardData,
          metrics: {
            ...mockAdminDashboardData.metrics,
            totalEmployees: data.totalEmployees ?? mockAdminDashboardData.metrics.totalEmployees,
            totalDrivers: data.totalDrivers ?? mockAdminDashboardData.metrics.totalDrivers,
            totalShuttles: data.totalShuttles ?? mockAdminDashboardData.metrics.totalShuttles,
            totalRoutes: data.totalRoutes ?? mockAdminDashboardData.metrics.totalRoutes,
            totalSchedules: data.totalSchedules ?? mockAdminDashboardData.metrics.totalSchedules,
            totalBookings: data.totalBookings ?? mockAdminDashboardData.metrics.totalBookings,
            totalAttendance: data.totalAttendance ?? mockAdminDashboardData.metrics.totalAttendance,
            activeShuttles: data.activeShuttles ?? mockAdminDashboardData.metrics.activeShuttles,
          },
        };
      }
      return mockAdminDashboardData;
    } catch (error) {
      console.warn('Backend dashboard API unavailable, using fallback data:', error);
      return mockAdminDashboardData;
    }
  },

  getLiveTracking: async (): Promise<LiveTrackingVehicle[]> => {
    try {
      const response = await apiClient.get<any>('/tracking/live');
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any, idx: number) => ({
          id: item.shuttleId || item.id || `shuttle-${idx}`,
          vehicleNumber: item.shuttleNumber || item.vehicleNumber || `OFF-GO-${100 + idx}`,
          driverName: item.driverName || 'Assigned Driver',
          routeName: item.routeName || 'Active Route',
          currentLocation: {
            lat: Number(item.latitude || 37.7749),
            lng: Number(item.longitude || -122.4194),
            address: item.currentStop || item.address || 'Active Route Waypoint',
          },
          speedKmH: Number(item.speed || 35),
          heading: Number(item.heading || 90),
          status: item.status || 'ON_TIME',
          occupancy: item.occupancy || 15,
          capacity: item.capacity || 24,
          lastUpdated: item.recordedAt ? new Date(item.recordedAt).toLocaleTimeString() : 'Just now',
        }));
      }
      return mockAdminDashboardData.liveTracking;
    } catch (error) {
      console.warn('Live tracking API unavailable, using fallback:', error);
      return mockAdminDashboardData.liveTracking;
    }
  },

  getNotifications: async (): Promise<AppNotification[]> => {
    try {
      const response = await apiClient.get<any>('/notifications');
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any, idx: number) => ({
          id: item.id || `notif-${idx}`,
          title: item.title || 'System Notification',
          message: item.message || item.content || '',
          type: item.type || 'INFO',
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Just now',
          read: item.read ?? false,
        }));
      }
      return mockAdminDashboardData.notifications;
    } catch (error) {
      return mockAdminDashboardData.notifications;
    }
  },
};
