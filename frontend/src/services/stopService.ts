import apiClient from '../api/axios';
import {
  StopDetailItem,
  CreateStopPayload,
  UpdateStopPayload,
  StopFilterOptions,
} from '../types';

let mockStopsState: StopDetailItem[] = [
  {
    id: 'stp-101',
    code: 'STP-SF-101',
    name: 'Financial District Terminal',
    address: 'Market St & 1st St, San Francisco, CA 94105',
    lat: 37.7905,
    lng: -122.398,
    landmark: 'Salesforce Transit Center Gate 4',
    city: 'San Francisco',
    zone: 'Zone A - Downtown Core',
    description: 'Primary downtown transit hub serving executive commuters and HQ staff.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-101',
        code: 'RT-EX-01',
        name: 'HQ Financial District Express Line A',
        status: 'ACTIVE',
        direction: 'Outbound',
      },
    ],
    schedules: [
      {
        id: 'sch-1',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '07:30 AM',
        arrivalTime: '08:00 AM',
        frequency: 'Every 15 mins',
        shuttleNumber: 'OFF-GO-101',
      },
      {
        id: 'sch-2',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '08:00 AM',
        arrivalTime: '08:30 AM',
        frequency: 'Every 15 mins',
        shuttleNumber: 'OFF-GO-104',
      },
    ],
    dailyTrafficCount: 420,
    createdDate: '2024-01-10',
    recentActivity: [
      {
        id: 'act-101',
        action: 'Shelter Sensor Maintenance Passed',
        timestamp: '2 hours ago',
        details: 'Digital display board and passenger counter verified.',
      },
      {
        id: 'act-102',
        action: 'High Boarding Alert Triggered',
        timestamp: 'Yesterday at 08:15 AM',
        details: 'Peak morning volume reached 185 passengers.',
      },
    ],
  },
  {
    id: 'stp-102',
    code: 'STP-SF-102',
    name: 'Montgomery BART Transit Gate',
    address: '599 Market St, San Francisco, CA 94105',
    lat: 37.789,
    lng: -122.401,
    landmark: 'Palace Hotel Entrance / BART Plaza',
    city: 'San Francisco',
    zone: 'Zone A - Downtown Core',
    description: 'BART & MUNI transfer stop with real-time digital ETA displays.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-101',
        code: 'RT-EX-01',
        name: 'HQ Financial District Express Line A',
        status: 'ACTIVE',
        direction: 'Inbound / Outbound',
      },
    ],
    schedules: [
      {
        id: 'sch-3',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '07:42 AM',
        arrivalTime: '08:12 AM',
        frequency: 'Every 15 mins',
        shuttleNumber: 'OFF-GO-101',
      },
    ],
    dailyTrafficCount: 310,
    createdDate: '2024-01-12',
    recentActivity: [
      {
        id: 'act-103',
        action: 'Digital Display Board Sync',
        timestamp: '1 day ago',
        details: 'Firmware updated to v3.4.1.',
      },
    ],
  },
  {
    id: 'stp-103',
    code: 'STP-SF-103',
    name: 'SOMA Tech Plaza Stop',
    address: '3rd St & Folsom St, San Francisco, CA 94107',
    lat: 37.784,
    lng: -122.399,
    landmark: 'Moscone Center West',
    city: 'San Francisco',
    zone: 'Zone B - SOMA Tech Corridor',
    description: 'Dedicated curb bay for employee shuttles in SOMA technology district.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-101',
        code: 'RT-EX-01',
        name: 'HQ Financial District Express Line A',
        status: 'ACTIVE',
        direction: 'Inbound',
      },
    ],
    schedules: [
      {
        id: 'sch-4',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '07:55 AM',
        arrivalTime: '08:25 AM',
        frequency: 'Every 15 mins',
        shuttleNumber: 'OFF-GO-101',
      },
    ],
    dailyTrafficCount: 280,
    createdDate: '2024-01-15',
    recentActivity: [],
  },
  {
    id: 'stp-104',
    code: 'STP-SF-104',
    name: 'Mission Bay Transit Hub',
    address: '4th St & King St, San Francisco, CA 94107',
    lat: 37.777,
    lng: -122.393,
    landmark: 'Caltrain Depot Plaza',
    city: 'San Francisco',
    zone: 'Zone B - SOMA Tech Corridor',
    description: 'Major multimodal connection hub linked with Caltrain and UCSF campus lines.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-101',
        code: 'RT-EX-01',
        name: 'HQ Financial District Express Line A',
        status: 'ACTIVE',
        direction: 'Outbound',
      },
    ],
    schedules: [
      {
        id: 'sch-5',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '08:10 AM',
        arrivalTime: '08:40 AM',
        frequency: 'Every 15 mins',
        shuttleNumber: 'OFF-GO-101',
      },
    ],
    dailyTrafficCount: 540,
    createdDate: '2024-01-20',
    recentActivity: [
      {
        id: 'act-104',
        action: 'CCTV Camera Inspection',
        timestamp: '3 days ago',
        details: 'All HD cameras operational.',
      },
    ],
  },
  {
    id: 'stp-105',
    code: 'STP-SF-105',
    name: 'Off-Go Innovation HQ',
    address: '500 Townsend St, San Francisco, CA 94103',
    lat: 37.7712,
    lng: -122.404,
    landmark: 'Off-Go Main Building A - Loading Bay 2',
    city: 'San Francisco',
    zone: 'Zone B - SOMA Tech Corridor',
    description: 'Main corporate headquarters drop-off bay with covered seating and waiting shelters.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-101',
        code: 'RT-EX-01',
        name: 'HQ Financial District Express Line A',
        status: 'ACTIVE',
        direction: 'Terminal Drop',
      },
    ],
    schedules: [
      {
        id: 'sch-6',
        routeName: 'HQ Financial District Express Line A',
        departureTime: '08:25 AM',
        arrivalTime: '08:25 AM',
        frequency: 'Continuous',
        shuttleNumber: 'OFF-GO-101',
      },
    ],
    dailyTrafficCount: 680,
    createdDate: '2023-11-01',
    recentActivity: [
      {
        id: 'act-105',
        action: 'Automated Passenger Counter Calibrated',
        timestamp: 'Yesterday',
        details: 'Accuracy rating 99.8%.',
      },
    ],
  },
  {
    id: 'stp-106',
    code: 'STP-MAR-106',
    name: 'Marina North Station',
    address: 'Lombard St & Van Ness Ave, San Francisco, CA 94123',
    lat: 37.8005,
    lng: -122.424,
    landmark: 'Fort Mason Center Entrance',
    city: 'San Francisco',
    zone: 'Zone C - Marina / North Peninsula',
    description: 'Northern residential boarding point for employees residing in Marina/Cow Hollow.',
    status: 'ACTIVE',
    routesAssigned: [
      {
        id: 'rt-102',
        code: 'RT-NC-02',
        name: 'North Tech Corridor Loop B',
        status: 'ACTIVE',
        direction: 'Southbound',
      },
    ],
    schedules: [
      {
        id: 'sch-7',
        routeName: 'North Tech Corridor Loop B',
        departureTime: '08:00 AM',
        arrivalTime: '08:45 AM',
        frequency: 'Every 20 mins',
        shuttleNumber: 'OFF-GO-104',
      },
    ],
    dailyTrafficCount: 195,
    createdDate: '2024-02-01',
    recentActivity: [],
  },
  {
    id: 'stp-107',
    code: 'STP-SM-107',
    name: 'West Park Commuter Garage',
    address: 'El Camino Real & 28th Ave, San Mateo, CA 94403',
    lat: 37.545,
    lng: -122.302,
    landmark: 'Hillsdale Caltrain Station West Bay',
    city: 'San Mateo',
    zone: 'Zone D - South Peninsula',
    description: 'Park & ride facility equipped with 120 dedicated Off-Go employee parking bays.',
    status: 'UNDER_MAINTENANCE',
    routesAssigned: [
      {
        id: 'rt-104',
        code: 'RT-WE-04',
        name: 'West Suburbs Executive Connector',
        status: 'UNDER_MAINTENANCE',
        direction: 'Inbound',
      },
    ],
    schedules: [],
    dailyTrafficCount: 0,
    createdDate: '2024-03-01',
    recentActivity: [
      {
        id: 'act-106',
        action: 'Under Maintenance Notice Posted',
        timestamp: '2 days ago',
        details: 'Curb resurfacing in progress by San Mateo Public Works.',
      },
    ],
  },
  {
    id: 'stp-108',
    code: 'STP-FRM-108',
    name: 'Fremont BART Terminal',
    address: 'Bart Way, Fremont, CA 94536',
    lat: 37.557,
    lng: -121.976,
    landmark: 'Fremont BART East Parking Plaza',
    city: 'Fremont',
    zone: 'Zone E - East Bay Corridor',
    description: 'Cross-bay commuter connection for East Bay staff members.',
    status: 'INACTIVE',
    routesAssigned: [
      {
        id: 'rt-105',
        code: 'RT-EA-05',
        name: 'East Bay BART Shuttle Link',
        status: 'INACTIVE',
        direction: 'Westbound',
      },
    ],
    schedules: [],
    dailyTrafficCount: 0,
    createdDate: '2023-09-20',
    recentActivity: [],
  },
];

const mapBackendStop = (s: any): StopDetailItem => {
  return {
    id: s.id ? String(s.id) : `stp-${Date.now()}`,
    code: s.stopCode || s.code || 'STP-101',
    name: s.stopName || s.name || 'Terminal Stop',
    address: s.address || 'Market St, San Francisco, CA',
    lat: Number(s.latitude ?? s.lat ?? 37.7749),
    lng: Number(s.longitude ?? s.lng ?? -122.4194),
    landmark: s.landmark || 'Central Station Marker',
    city: s.city || 'San Francisco',
    zone: s.zone || 'Zone A - Downtown Core',
    description: s.description || 'Active shuttle pickup and drop point.',
    status: s.active !== false ? 'ACTIVE' : 'INACTIVE',
    routesAssigned: s.routesAssigned || [],
    schedules: s.schedules || [],
    dailyTrafficCount: s.dailyTrafficCount || 120,
    createdDate: s.createdDate || new Date().toISOString().split('T')[0],
    recentActivity: s.recentActivity || [],
  };
};

export const stopService = {
  /**
   * GET /api/v1/stops
   */
  getStops: async (filters?: StopFilterOptions): Promise<StopDetailItem[]> => {
    try {
      const response = await apiClient.get<any>('/stops');
      const rawList = response.data?.data || response.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        let items = rawList.map(mapBackendStop);
        if (filters?.searchQuery?.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          items = items.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.code.toLowerCase().includes(q) ||
              s.address.toLowerCase().includes(q)
          );
        }
        return items;
      }
      return [...mockStopsState];
    } catch (error) {
      console.warn('Backend /stops error, using fallback:', error);
      return [...mockStopsState];
    }
  },

  /**
   * GET /api/v1/stops/{id}
   */
  getStopById: async (id: string): Promise<StopDetailItem> => {
    try {
      const response = await apiClient.get<any>(`/stops/${id}`);
      const data = response.data?.data || response.data;
      if (data && typeof data === 'object') {
        return mapBackendStop(data);
      }
      throw new Error('Invalid stop data');
    } catch {
      const found = mockStopsState.find((s) => s.id === id || s.code === id);
      if (!found) {
        throw new Error(`Stop with ID ${id} not found.`);
      }
      return found;
    }
  },

  /**
   * POST /api/v1/stops
   */
  createStop: async (payload: CreateStopPayload): Promise<StopDetailItem> => {
    try {
      const backendPayload = {
        stopCode: (payload as any).code || `STP-${Math.floor(100 + Math.random() * 900)}`,
        stopName: payload.name,
        address: payload.address,
        landmark: payload.landmark || 'Shuttle Sign Marker',
        latitude: Number(payload.lat) || 37.7749,
        longitude: Number(payload.lng) || -122.4194,
      };
      const response = await apiClient.post<any>('/stops', backendPayload);
      const data = response.data?.data || response.data;
      const created = mapBackendStop(data);
      mockStopsState = [created, ...mockStopsState];
      return created;
    } catch (error) {
      console.warn('Create stop backend call failed, fallback locally:', error);
      const newStop: StopDetailItem = {
        id: `stp-${Date.now()}`,
        code: (payload as any).code || `STP-NEW-${Math.floor(100 + Math.random() * 900)}`,
        name: payload.name,
        address: payload.address,
        lat: Number(payload.lat) || 37.7749,
        lng: Number(payload.lng) || -122.4194,
        landmark: payload.landmark || 'Standard Shuttle Bay Marker',
        city: payload.city || 'San Francisco',
        zone: payload.zone || 'Zone A - Downtown Core',
        description: payload.description || 'Newly registered shuttle stop location.',
        status: payload.status || 'ACTIVE',
        routesAssigned: [],
        schedules: [],
        dailyTrafficCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        recentActivity: [
          {
            id: `act-${Date.now()}`,
            action: 'Stop Created in Location Registry',
            timestamp: 'Just now',
            details: 'Coordinates and physical landmark verified.',
          },
        ],
      };

      mockStopsState = [newStop, ...mockStopsState];
      return newStop;
    }
  },

  /**
   * PUT /api/v1/stops/{id}
   */
  updateStop: async (payload: UpdateStopPayload): Promise<StopDetailItem> => {
    try {
      const response = await apiClient.put<any>(`/stops/${payload.id}`, payload);
      const data = response.data?.data || response.data;
      const updated = mapBackendStop(data);
      const idx = mockStopsState.findIndex((s) => s.id === payload.id);
      if (idx !== -1) mockStopsState[idx] = updated;
      return updated;
    } catch {
      const idx = mockStopsState.findIndex((s) => s.id === payload.id);
      if (idx === -1) {
        throw new Error(`Stop with ID ${payload.id} not found.`);
      }

      const existing = mockStopsState[idx];
      const updated: StopDetailItem = {
        ...existing,
        ...payload,
        name: payload.name || existing.name,
        address: payload.address || existing.address,
        lat: payload.lat ? Number(payload.lat) : existing.lat,
        lng: payload.lng ? Number(payload.lng) : existing.lng,
        landmark: payload.landmark ?? existing.landmark,
        city: payload.city || existing.city,
        zone: payload.zone || existing.zone,
        description: payload.description ?? existing.description,
        status: payload.status || existing.status,
      };

      mockStopsState[idx] = updated;
      return updated;
    }
  },

  /**
   * DELETE /api/v1/stops/{id}
   */
  deleteStop: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/stops/${id}`);
      mockStopsState = mockStopsState.filter((s) => s.id !== id);
      return true;
    } catch {
      mockStopsState = mockStopsState.filter((s) => s.id !== id);
      return true;
    }
  },
};
