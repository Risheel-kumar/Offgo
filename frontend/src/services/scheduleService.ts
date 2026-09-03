import apiClient from '../api/axios';
import {
  ScheduleItem,
  ScheduleFilterOptions,
  CreateSchedulePayload,
  UpdateSchedulePayload,
} from '../types';

let mockSchedulesState: ScheduleItem[] = [
  {
    id: 'sch-101',
    code: 'SCH-EX-01',
    routeId: 'rt-101',
    routeName: 'HQ Financial District Express Line A',
    routeCode: 'RT-EX-01',
    startLocation: 'Financial District Terminal',
    endLocation: 'Off-Go Innovation HQ',
    shuttleId: 'sht-1',
    shuttleNumber: 'OFF-GO-101',
    shuttleModel: 'Volvo 9700 Luxury Shuttle',
    driverId: 'drv-1',
    driverName: 'David Miller',
    driverPhone: '+1 (555) 234-5678',
    departureTime: '07:30 AM',
    arrivalTime: '08:25 AM',
    durationMinutes: 55,
    bufferTimeMinutes: 15,
    operatingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    shift: 'MORNING',
    status: 'RUNNING',
    createdDate: '2024-01-15',
    estimatedStopsCount: 5,
    conflictWarnings: [],
    recentActivity: [
      {
        id: 'act-s1',
        action: 'Trip Started On Time',
        timestamp: '07:30 AM Today',
        details: 'Driver David Miller initiated route sequence with OFF-GO-101.',
      },
      {
        id: 'act-s2',
        action: 'Schedule Published',
        timestamp: '2 days ago',
        details: 'Assigned to weekday morning commute slot.',
      },
    ],
  },
  {
    id: 'sch-102',
    code: 'SCH-EX-02',
    routeId: 'rt-101',
    routeName: 'HQ Financial District Express Line A',
    routeCode: 'RT-EX-01',
    startLocation: 'Financial District Terminal',
    endLocation: 'Off-Go Innovation HQ',
    shuttleId: 'sht-2',
    shuttleNumber: 'OFF-GO-102',
    shuttleModel: 'Mercedes Sprinter Executive',
    driverId: 'drv-2',
    driverName: 'Sarah Jenkins',
    driverPhone: '+1 (555) 345-6789',
    departureTime: '08:00 AM',
    arrivalTime: '08:55 AM',
    durationMinutes: 55,
    bufferTimeMinutes: 15,
    operatingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    shift: 'MORNING',
    status: 'SCHEDULED',
    createdDate: '2024-01-16',
    estimatedStopsCount: 5,
    conflictWarnings: [],
    recentActivity: [],
  },
  {
    id: 'sch-103',
    code: 'SCH-NC-01',
    routeId: 'rt-102',
    routeName: 'North Tech Corridor Loop B',
    routeCode: 'RT-NC-02',
    startLocation: 'Marina North Station',
    endLocation: 'Off-Go Innovation HQ',
    shuttleId: 'sht-3',
    shuttleNumber: 'OFF-GO-104',
    shuttleModel: 'BYD K9 Electric Bus',
    driverId: 'drv-3',
    driverName: 'Robert Thorne',
    driverPhone: '+1 (555) 456-7890',
    departureTime: '08:00 AM',
    arrivalTime: '08:35 AM',
    durationMinutes: 35,
    bufferTimeMinutes: 10,
    operatingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    shift: 'MORNING',
    status: 'SCHEDULED',
    createdDate: '2024-01-18',
    estimatedStopsCount: 3,
    conflictWarnings: [],
    recentActivity: [],
  },
  {
    id: 'sch-104',
    code: 'SCH-WE-01',
    routeId: 'rt-104',
    routeName: 'West Suburbs Executive Connector',
    routeCode: 'RT-WE-04',
    startLocation: 'West Park Commuter Garage',
    endLocation: 'Off-Go Innovation HQ',
    shuttleId: 'sht-4',
    shuttleNumber: 'OFF-GO-108',
    shuttleModel: 'Ford Transit HD 350',
    driverId: 'drv-4',
    driverName: 'Elena Rostova',
    driverPhone: '+1 (555) 567-8901',
    departureTime: '05:15 PM',
    arrivalTime: '06:10 PM',
    durationMinutes: 55,
    bufferTimeMinutes: 15,
    operatingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    shift: 'EVENING',
    status: 'DELAYED',
    createdDate: '2024-02-01',
    estimatedStopsCount: 4,
    conflictWarnings: [
      'Traffic Advisory: Highway 101 South congestion reported (+12 mins).',
    ],
    recentActivity: [
      {
        id: 'act-s3',
        action: 'Delay Warning Issued',
        timestamp: '10 mins ago',
        details: 'System automatically adjusted arrival estimate due to traffic feed.',
      },
    ],
  },
  {
    id: 'sch-105',
    code: 'SCH-EA-01',
    routeId: 'rt-105',
    routeName: 'East Bay BART Shuttle Link',
    routeCode: 'RT-EA-05',
    startLocation: 'Fremont BART Terminal',
    endLocation: 'Off-Go Innovation HQ',
    shuttleId: 'sht-5',
    shuttleNumber: 'OFF-GO-112',
    shuttleModel: 'Volvo 9700 Luxury Shuttle',
    driverId: 'drv-5',
    driverName: 'Marcus Vance',
    driverPhone: '+1 (555) 678-9012',
    departureTime: '07:15 AM',
    arrivalTime: '08:15 AM',
    durationMinutes: 60,
    bufferTimeMinutes: 20,
    operatingDays: ['MON', 'WED', 'FRI'],
    shift: 'MORNING',
    status: 'CANCELLED',
    createdDate: '2024-02-10',
    estimatedStopsCount: 2,
    conflictWarnings: [
      'Vehicle Maintenance Lock: OFF-GO-112 is scheduled for brake pad service.',
    ],
    recentActivity: [
      {
        id: 'act-s4',
        action: 'Trip Cancelled by Dispatch',
        timestamp: 'Yesterday at 04:00 PM',
        details: 'Shuttle maintenance required. Passengers re-routed.',
      },
    ],
  },
  {
    id: 'sch-106',
    code: 'SCH-EX-03',
    routeId: 'rt-101',
    routeName: 'HQ Financial District Express Line A',
    routeCode: 'RT-EX-01',
    startLocation: 'Off-Go Innovation HQ',
    endLocation: 'Financial District Terminal',
    shuttleId: 'sht-1',
    shuttleNumber: 'OFF-GO-101',
    shuttleModel: 'Volvo 9700 Luxury Shuttle',
    driverId: 'drv-1',
    driverName: 'David Miller',
    driverPhone: '+1 (555) 234-5678',
    departureTime: '05:30 PM',
    arrivalTime: '06:25 PM',
    durationMinutes: 55,
    bufferTimeMinutes: 15,
    operatingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    shift: 'EVENING',
    status: 'SCHEDULED',
    createdDate: '2024-01-15',
    estimatedStopsCount: 5,
    conflictWarnings: [],
    recentActivity: [],
  },
];

const parseTimeToMinutes = (timeValue?: string) => {
  if (!timeValue) return 0;
  const raw = String(timeValue).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[4]?.toUpperCase();

  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (meridiem === 'PM' && hours < 12) hours += 12;

  return hours * 60 + minutes;
};

const getDateFromSchedule = (schedule: Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, isEnd = false) => {
  const dateValue = isEnd ? (schedule.endDate || schedule.startDate || schedule.createdDate) : (schedule.startDate || schedule.createdDate);
  if (!dateValue) {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);
    return new Date(`${dateString}T${isEnd ? (schedule.arrivalTime || '00:00') : (schedule.departureTime || '00:00')}`);
  }

  const dateString = String(dateValue).slice(0, 10);
  const timeValue = isEnd ? (schedule.arrivalTime || '00:00') : (schedule.departureTime || '00:00');
  const normalized = String(timeValue).trim();
  const timeText = normalized.match(/^(\d{1,2}:\d{2})(?::\d{2})?\s*(AM|PM)?$/i)
    ? normalized
    : `${String(Math.floor(parseTimeToMinutes(timeValue) / 60)).padStart(2, '0')}:${String(parseTimeToMinutes(timeValue) % 60).padStart(2, '0')}`;

  return new Date(`${dateString}T${timeText}`);
};

export const getScheduleState = (schedule: Partial<ScheduleItem>, now = new Date()): 'ACTIVE' | 'UPCOMING' | 'COMPLETED' => {
  const startTime = getDateFromSchedule(schedule as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, false);
  const endTime = getDateFromSchedule(schedule as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, true);

  if (now < startTime) return 'UPCOMING';
  if (now > endTime) return 'COMPLETED';
  return 'ACTIVE';
};

export const getCurrentScheduleFromList = (schedules: Partial<ScheduleItem>[], now = new Date()) => {
  if (!schedules.length) return null;

  const activeSchedules = schedules.filter((schedule) => getScheduleState(schedule, now) === 'ACTIVE');
  if (activeSchedules.length > 0) {
    return activeSchedules.sort((a, b) => {
      const aStart = getDateFromSchedule(a as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, false);
      const bStart = getDateFromSchedule(b as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, false);
      return aStart.getTime() - bStart.getTime();
    })[0];
  }

  return schedules
    .sort((a, b) => {
      const aStart = getDateFromSchedule(a as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, false);
      const bStart = getDateFromSchedule(b as Pick<ScheduleItem, 'startDate' | 'endDate' | 'departureTime' | 'arrivalTime' | 'createdDate'>, false);
      return aStart.getTime() - bStart.getTime();
    })[0];
};

const mapBackendSchedule = (s: any): ScheduleItem => {
  return {
    id: s.id ? String(s.id) : `sch-${Date.now()}`,
    code: s.code || `SCH-${Math.floor(100 + Math.random() * 900)}`,
    routeId: s.routeId ? String(s.routeId) : '',
    routeName: s.routeName || 'Executive Corridor Line',
    routeCode: s.routeCode || '',
    startLocation: s.startLocation || '',
    endLocation: s.endLocation || '',
    shuttleId: s.shuttleId ? String(s.shuttleId) : '',
    shuttleNumber: s.shuttleNumber || '',
    shuttleModel: s.shuttleModel || '',
    driverId: s.driverId ? String(s.driverId) : '',
    driverName: s.driverName || '',
    driverPhone: s.driverPhone || '',
    trackingEnabled: Boolean(s.trackingEnabled),
    departureTime: s.departureTime ? String(s.departureTime).slice(0, 5) : '',
    arrivalTime: s.arrivalTime ? String(s.arrivalTime).slice(0, 5) : '',
    startDate: s.startDate ? String(s.startDate) : '',
    endDate: s.endDate ? String(s.endDate) : '',
    durationMinutes: Number(s.durationMinutes || 0),
    bufferTimeMinutes: Number(s.bufferTimeMinutes || 0),
    operatingDays: s.operatingDays || [],
    shift: s.shift || 'ALL_DAY',
    status: s.status || 'SCHEDULED',
    createdDate: s.startDate ? String(s.startDate) : '',
    estimatedStopsCount: Number(s.estimatedStopsCount || 0),
    conflictWarnings: [],
    recentActivity: s.recentActivity || [],
  };
};

export const scheduleService = {
  /**
   * GET /api/v1/schedules
   */
  getSchedules: async (filters?: ScheduleFilterOptions): Promise<ScheduleItem[]> => {
    try {
      const response = await apiClient.get<any>('/schedules');
      const rawList = response.data?.data || response.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        let items = rawList.map(mapBackendSchedule);
        if (filters?.searchQuery?.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          items = items.filter(
            (s) =>
              s.routeName.toLowerCase().includes(q) ||
              s.driverName.toLowerCase().includes(q) ||
              s.shuttleNumber.toLowerCase().includes(q)
          );
        }
        return items;
      }
      return [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /api/v1/schedules/{id}
   */
  getScheduleById: async (id: string): Promise<ScheduleItem> => {
    const response = await apiClient.get<any>(`/schedules/${id}`);
    const data = response.data?.data || response.data;
    if (data && typeof data === 'object') {
      return mapBackendSchedule(data);
    }
    throw new Error('Invalid schedule data');
  },

  /**
   * POST /api/v1/schedules
   */
  createSchedule: async (payload: CreateSchedulePayload): Promise<ScheduleItem> => {
    try {
      const formatTime = (t?: string) => {
        if (!t) return '08:00:00';
        if (t.length === 5) return `${t}:00`;
        return t;
      };
      const backendPayload = {
        routeId: payload.routeId,
        driverId: payload.driverId,
        shuttleId: payload.shuttleId,
        departureTime: formatTime(payload.departureTime),
        arrivalTime: formatTime(payload.arrivalTime),
        startDate: payload.startDate || new Date().toISOString().split('T')[0],
        endDate: payload.endDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      };
      const response = await apiClient.post<any>('/schedules', backendPayload);
      const data = response.data?.data || response.data;
      const created = mapBackendSchedule(data);
      return created;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT /api/v1/schedules/{id}
   */
  updateSchedule: async (payload: UpdateSchedulePayload): Promise<ScheduleItem> => {
    try {
      const response = await apiClient.put<any>(`/schedules/${payload.id}`, payload);
      const data = response.data?.data || response.data;
      const updated = mapBackendSchedule(data);
      return updated;
    } catch {
      throw new Error(`Schedule with ID ${payload.id} could not be updated.`);
    }
  },

  /**
   * DELETE /api/v1/schedules/{id}
   */
  deleteSchedule: async (id: string): Promise<boolean> => {
    await apiClient.delete(`/schedules/${id}`);
    return true;
  },
};
