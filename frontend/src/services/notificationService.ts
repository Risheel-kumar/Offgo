import apiClient from '../api/axios';
import {
  EnterpriseNotification,
  NotificationFilterOptions,
} from '../types';

// Mock initial data covering all Notification Types and Priority levels
let mockNotificationsState: EnterpriseNotification[] = [
  {
    id: 'notif-101',
    title: 'CRITICAL: Engine Overheat Alert',
    message: 'Shuttle OFF-GO-104 reported high coolant temperature (108°C) near Marina North Station. Telemetry diagnostic triggered.',
    type: 'SYSTEM_ALERT',
    priority: 'CRITICAL',
    relatedModule: 'SYSTEM',
    relatedEntityId: 'sht-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago (Today)
    read: false,
    actionUrl: '/admin/shuttles',
    actionText: 'Open Fleet Telemetry',
    metadata: { vehicleNumber: 'OFF-GO-104', sensorCode: 'TEMP_HIGH' },
  },
  {
    id: 'notif-102',
    title: 'Trip Started: Financial District Express',
    message: 'Driver David Miller initiated trip TRIP-OFF-901 for Route HQ Financial District Express Line A with 18 onboard passengers.',
    type: 'TRIP_STARTED',
    priority: 'LOW',
    relatedModule: 'TRIPS',
    relatedEntityId: 'trp-1001',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago (Today)
    read: false,
    actionUrl: '/admin/trips',
    actionText: 'Open Trip Monitor',
    metadata: { routeCode: 'RT-101', driverName: 'David Miller' },
  },
  {
    id: 'notif-103',
    title: 'New Seat Booking Confirmed',
    message: 'Employee Alexander Wright booked seat 12B on Evening Departure #OFF-BKG-88301.',
    type: 'BOOKING_CREATED',
    priority: 'MEDIUM',
    relatedModule: 'BOOKINGS',
    relatedEntityId: 'bkg-88301',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~1.8 hours ago (Today)
    read: false,
    actionUrl: '/admin/users',
    actionText: 'View User',
    metadata: { passengerName: 'Alexander Wright', seatNumber: '12B' },
  },
  {
    id: 'notif-104',
    title: 'High Priority: Route Path Altered',
    message: 'Route "HQ Financial District Express" updated: Added temporary detours around SOMA Construction Zone.',
    type: 'ROUTE_UPDATED',
    priority: 'HIGH',
    relatedModule: 'ROUTES',
    relatedEntityId: 'rt-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago (Today)
    read: true,
    actionUrl: '/admin/routes',
    actionText: 'Open Route Builder',
    metadata: { routeId: 'rt-101', updatedBy: 'Fleet Operations Manager' },
  },
  {
    id: 'notif-105',
    title: 'Booking Cancelled by Passenger',
    message: 'Employee Sophia Rodriguez cancelled booking #OFF-BKG-88302 for the 05:15 PM West Suburbs Connector.',
    type: 'BOOKING_CANCELLED',
    priority: 'HIGH',
    relatedModule: 'BOOKINGS',
    relatedEntityId: 'bkg-88302',
    timestamp: new Date(Date.now() - 1000 * 3600 * 7).toISOString(), // 7 hours ago (Today)
    read: false,
    actionUrl: '/admin/users',
    actionText: 'View User Activity',
    metadata: { passengerName: 'Sophia Rodriguez', reason: 'Schedule Conflict' },
  },
  {
    id: 'notif-106',
    title: 'Shuttle Assigned to Route B',
    message: 'Electric Shuttle OFF-GO-112 successfully assigned to North Tech Corridor Loop B for evening shift.',
    type: 'SHUTTLE_ASSIGNED',
    priority: 'MEDIUM',
    relatedModule: 'SHUTTLES',
    relatedEntityId: 'sht-3',
    timestamp: new Date(Date.now() - 1000 * 3600 * 26).toISOString(), // Yesterday
    read: true,
    actionUrl: '/admin/shuttles',
    actionText: 'Open Shuttle Management',
  },
  {
    id: 'notif-107',
    title: 'Driver Reassigned to Shift',
    message: 'Driver Elena Rostova assigned to West Suburbs Executive Connector (05:15 PM Departure).',
    type: 'DRIVER_ASSIGNED',
    priority: 'MEDIUM',
    relatedModule: 'DRIVERS',
    relatedEntityId: 'drv-4',
    timestamp: new Date(Date.now() - 1000 * 3600 * 30).toISOString(), // Yesterday
    read: true,
    actionUrl: '/admin/drivers',
    actionText: 'Open Driver Roster',
  },
  {
    id: 'notif-108',
    title: 'Company Announcement: Q3 Shuttle Expansion',
    message: 'We are expanding 4 new routes servicing South Bay and East Peninsula tech hubs starting next Monday!',
    type: 'ANNOUNCEMENT',
    priority: 'LOW',
    relatedModule: 'ANNOUNCEMENTS',
    timestamp: new Date(Date.now() - 1000 * 3600 * 48).toISOString(), // 2 days ago (Earlier This Week)
    read: true,
    actionUrl: '/admin/announcements',
    actionText: 'Read Full Announcement',
  },
  {
    id: 'notif-109',
    title: 'Trip Completed: Route 102 Evening',
    message: 'Trip TRIP-OFF-881 finished on schedule. Total 16 passengers safely dropped.',
    type: 'TRIP_COMPLETED',
    priority: 'LOW',
    relatedModule: 'TRIPS',
    relatedEntityId: 'his-2',
    timestamp: new Date(Date.now() - 1000 * 3600 * 72).toISOString(), // 3 days ago (Earlier This Week)
    read: true,
    actionUrl: '/admin/trips',
    actionText: 'View Trip History',
  },
  {
    id: 'notif-110',
    title: 'Schedule Updated for Monsoon Season',
    message: 'Peak hour departures adjusted by +5 minutes buffer across all North Corridor schedules.',
    type: 'SCHEDULE_UPDATED',
    priority: 'MEDIUM',
    relatedModule: 'SCHEDULES',
    timestamp: new Date(Date.now() - 1000 * 3600 * 120).toISOString(), // 5 days ago (Older)
    read: true,
    actionUrl: '/admin/schedules',
    actionText: 'Review Timetables',
  },
];

export const notificationService = {
  /**
   * GET /api/v1/notifications
   * Fetch list of notifications with optional search and filters
   */
  getNotifications: async (filters?: NotificationFilterOptions): Promise<EnterpriseNotification[]> => {
    try {
      const response = await apiClient.get<EnterpriseNotification[]>('/notifications', { params: filters });
      return response.data;
    } catch {
      let results = [...mockNotificationsState];

      if (filters) {
        // Debounced Search Query Filter
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.message.toLowerCase().includes(q) ||
              n.type.toLowerCase().includes(q) ||
              n.relatedModule.toLowerCase().includes(q)
          );
        }

        // Notification Type Filter
        if (filters.typeFilter && filters.typeFilter !== 'ALL') {
          results = results.filter((n) => n.type === filters.typeFilter);
        }

        // Priority Filter
        if (filters.priorityFilter && filters.priorityFilter !== 'ALL') {
          results = results.filter((n) => n.priority === filters.priorityFilter);
        }

        // Read Status Filter
        if (filters.readStatus && filters.readStatus !== 'ALL') {
          if (filters.readStatus === 'UNREAD') {
            results = results.filter((n) => !n.read);
          } else if (filters.readStatus === 'READ') {
            results = results.filter((n) => n.read);
          }
        }

        // Date Range Filter
        if (filters.dateRange && filters.dateRange !== 'ALL') {
          const now = Date.now();
          const oneDayMs = 24 * 60 * 60 * 1000;
          const oneWeekMs = 7 * oneDayMs;

          results = results.filter((n) => {
            const time = new Date(n.timestamp).getTime();
            const diff = now - time;

            if (filters.dateRange === 'TODAY') {
              return diff <= oneDayMs;
            }
            if (filters.dateRange === 'THIS_WEEK') {
              return diff <= oneWeekMs;
            }
            if (filters.dateRange === 'OLDER') {
              return diff > oneWeekMs;
            }
            return true;
          });
        }
      }

      // Sort chronological descending (latest first)
      return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  },

  /**
   * GET /api/v1/notifications/{id}
   */
  getNotificationById: async (id: string): Promise<EnterpriseNotification | null> => {
    try {
      const response = await apiClient.get<EnterpriseNotification>(`/notifications/${id}`);
      return response.data;
    } catch {
      return mockNotificationsState.find((n) => n.id === id) || null;
    }
  },

  /**
   * GET /api/v1/notifications/unread-count
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
      return response.data.count;
    } catch {
      return mockNotificationsState.filter((n) => !n.read).length;
    }
  },

  /**
   * PUT /api/v1/notifications/{id}/read
   */
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      return true;
    } catch {
      const item = mockNotificationsState.find((n) => n.id === id);
      if (item) {
        item.read = true;
      }
      return true;
    }
  },

  /**
   * PUT /api/v1/notifications/{id}/unread
   */
  markAsUnread: async (id: string): Promise<boolean> => {
    try {
      await apiClient.put(`/notifications/${id}/unread`);
      return true;
    } catch {
      const item = mockNotificationsState.find((n) => n.id === id);
      if (item) {
        item.read = false;
      }
      return true;
    }
  },

  /**
   * PUT /api/v1/notifications/mark-all-read
   */
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await apiClient.put('/notifications/mark-all-read');
      return true;
    } catch {
      mockNotificationsState = mockNotificationsState.map((n) => ({ ...n, read: true }));
      return true;
    }
  },

  /**
   * DELETE /api/v1/notifications/clear-read
   */
  clearReadNotifications: async (): Promise<boolean> => {
    try {
      await apiClient.delete('/notifications/clear-read');
      return true;
    } catch {
      mockNotificationsState = mockNotificationsState.filter((n) => !n.read);
      return true;
    }
  },

  /**
   * DELETE /api/v1/notifications/{id}
   */
  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      return true;
    } catch {
      mockNotificationsState = mockNotificationsState.filter((n) => n.id !== id);
      return true;
    }
  },
};
