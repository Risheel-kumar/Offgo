export type Role = 'ADMIN' | 'EMPLOYEE' | 'DRIVER' | 'FLEET_MANAGER';

export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  employeeId?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  createdAt: string;
}

export type ShuttleStatus = 'ACTIVE' | 'AVAILABLE' | 'IN_SERVICE' | 'ON_TIME' | 'DELAYED' | 'IN_TRANSIT' | 'MAINTENANCE' | 'INACTIVE' | 'IDLE' | 'COMPLETED';

export interface Shuttle {
  id: string;
  vehicleNumber: string;
  model: string;
  capacity: number;
  totalSeats?: number;
  availableSeats?: number;
  bookedSeats?: number;
  occupancy: number;
  driverName: string;
  driverPhone: string;
  trackingEnabled?: boolean;
  routeName: string;
  routeId: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  speedKmH: number;
  status: ShuttleStatus;
  nextStop: string;
  etaNextStopMinutes: number;
  fuelLevelPercent: number;
  lastUpdated: string;
}

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  sequenceOrder: number;
  scheduledTime: string;
  estimatedTime?: string;
  passengerBoardingCount: number;
  passengerAlightingCount: number;
}

export interface ShuttleRoute {
  id: string;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  stops: RouteStop[];
  activeShuttlesCount: number;
  dailyRidership: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MODIFIED';
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Booking {
  id: string;
  bookingRef: string;
  employeeId?: string;
  scheduleId?: string;
  employeeName?: string;
  routeId?: string;
  routeName: string;
  shuttleId?: string;
  shuttleNumber?: string;
  shuttleVehicleNumber?: string;
  pickupStop?: string;
  pickupStopName?: string;
  dropoffStop?: string;
  dropStopName?: string;
  pickupTime: string;
  seatNumber?: string;
  status: BookingStatus | string;
  date: string;
}

export type NotificationType = 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';

export type EnterpriseNotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'SHUTTLE_ASSIGNED'
  | 'DRIVER_ASSIGNED'
  | 'ROUTE_UPDATED'
  | 'SCHEDULE_UPDATED'
  | 'ANNOUNCEMENT'
  | 'SYSTEM_ALERT';

export type NotificationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type NotificationModule =
  | 'BOOKINGS'
  | 'TRIPS'
  | 'SHUTTLES'
  | 'DRIVERS'
  | 'ROUTES'
  | 'SCHEDULES'
  | 'ANNOUNCEMENTS'
  | 'SYSTEM';

export interface EnterpriseNotification {
  id: string;
  title: string;
  message: string;
  type: EnterpriseNotificationType;
  priority: NotificationPriority;
  relatedModule: NotificationModule;
  relatedEntityId?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilterOptions {
  searchQuery?: string;
  typeFilter?: string;
  priorityFilter?: string;
  readStatus?: 'ALL' | 'UNREAD' | 'READ';
  dateRange?: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'OLDER';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  totalDrivers: number;
  totalShuttles: number;
  totalRoutes: number;
  totalSchedules: number;
  totalBookings: number;
  totalAttendance: number;
  attendanceRatePercent: number;
  activeShuttles: number;
  onTimePercentage: number;
  totalDailyPassengers: number;
  co2SavedKg: number;
  avgOccupancyRatePercent: number;
}

export interface BookingTrendItem {
  date: string;
  bookings: number;
  completed: number;
  cancelled: number;
}

export interface AttendanceTrendItem {
  day: string;
  present: number;
  absent: number;
  rate: number;
}

export interface FleetUsageItem {
  name: string;
  inService: number;
  maintenance: number;
  idle: number;
}

export interface RouteDistributionItem {
  routeName: string;
  passengers: number;
  color: string;
}

export interface MonthlyActivityItem {
  month: string;
  trips: number;
  passengers: number;
  efficiency: number;
}

export interface LiveTrackingVehicle {
  id: string;
  shuttleId?: string;
  vehicleNumber: string;
  model?: string;
  driverId?: string;
  driverName: string;
  driverPhone?: string;
  routeId?: string;
  routeName: string;
  routeCode?: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
    updatedAt?: string;
  };
  speedKmH: number;
  heading: number;
  status: ShuttleStatus;
  totalSeats?: number;
  availableSeats?: number;
  bookedSeats?: number;
  occupancy?: number;
  capacity?: number;
  occupancyCount?: number;
  maxCapacity?: number;
  lastUpdated?: string;
  fuelLevelPercent?: number;
  batteryLevelPercent?: number;
  nextStop?: string;
  nextStopEtaMinutes?: number;
  distanceRemainingKm?: number;
  estimatedDurationMinutes?: number;
  departureTime?: string;
  arrivalTime?: string;
  scheduleStatus?: string;
  trackingEnabled?: boolean;
  isActive?: boolean;
  visitedStopsCount?: number;
  totalStopsCount?: number;
  tripProgressPercent?: number;
  assignedPassengers?: {
    id: string;
    name: string;
    seatNumber: string;
    boardingStop: string;
    checkedIn: boolean;
  }[];
}

export interface ActivityLogItem {
  id: string;
  type: 'EMPLOYEE_ADDED' | 'BOOKING_CREATED' | 'DRIVER_ASSIGNED' | 'ROUTE_UPDATED' | 'SHUTTLE_DISPATCHED';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status?: string;
}

export interface RouteProgressData {
  shuttleId: string;
  vehicleNumber: string;
  routeName: string;
  progressPercent: number;
  totalStops: number;
  completedStopsCount: number;
  remainingStopsCount: number;
  stops: {
    id: string;
    stopName: string;
    sequenceOrder: number;
    scheduledTime: string;
    actualTime?: string;
    status: 'VISITED' | 'CURRENT' | 'UPCOMING';
  }[];
}

export interface CurrentStopData {
  shuttleId: string;
  stopId: string;
  stopName: string;
  arrivalTime: string;
  departureTime?: string;
  status: 'ARRIVING' | 'BOARDING' | 'DEPARTED';
  passengerOnboardingCount: number;
  passengerOffboardingCount: number;
}

export interface ETAData {
  shuttleId: string;
  destinationStopName: string;
  etaMinutes: number;
  estimatedArrivalTime: string;
  remainingDistanceKm: number;
  trafficCondition: 'LIGHT' | 'MODERATE' | 'HEAVY';
}

export interface LocationHistoryPoint {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  speedKmH: number;
  heading: number;
  stopName?: string;
}

export interface FleetSummaryMetrics {
  totalFleet?: number;
  activeVehicles?: number;
  inactiveVehicles?: number;
  avgSpeedKmH?: number;
  delayedVehicles?: number;
  avgETAMinutes?: number;
  totalVehicles: number;
  running: number;
  idle: number;
  maintenance: number;
  offline: number;
}

export interface FleetFilterOptions {
  searchQuery: string;
  statusFilter: string;
  routeFilter: string;
  currentStopFilter: string;
  minSpeed: number;
  maxSpeed: number;
}

export interface EmployeeEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmployeeAttendanceSummary {
  totalRides: number;
  attendanceRatePercent: number;
  missedRides: number;
  onTimeCheckins: number;
}

export interface EmployeeAssignedShuttle {
  shuttleId: string;
  vehicleNumber: string;
  routeName: string;
  pickupStop: string;
}

export interface EmployeeCurrentBooking {
  bookingId: string;
  bookingRef: string;
  routeName: string;
  pickupStop: string;
  dropoffStop: string;
  scheduledTime: string;
  status: BookingStatus;
  date: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';
  createdAt: string;
  updatedAt?: string;
  address?: string;
  avatar?: string;
  assignedShuttle?: EmployeeAssignedShuttle;
  currentBooking?: EmployeeCurrentBooking;
  emergencyContact?: EmployeeEmergencyContact;
  attendanceSummary?: EmployeeAttendanceSummary;
}

export interface CreateEmployeePayload {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';
  emergencyContact?: EmployeeEmergencyContact;
}

export interface EmployeeFilterOptions {
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  shuttleFilter: string;
  bookingStatusFilter: string;
}

export interface DriverAssignedShuttle {
  shuttleId: string;
  vehicleNumber: string;
  model?: string;
  capacity?: number;
  status?: string;
}

export interface DriverAssignedRoute {
  routeId: string;
  routeName: string;
  code?: string;
  totalStops?: number;
  estimatedDurationMinutes?: number;
}

export interface DriverEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface DriverAttendanceSummary {
  totalShifts: number;
  presentShifts: number;
  lateCount: number;
  attendanceRatePercent: number;
}

export interface DriverTripStatistics {
  totalTripsCompleted?: number;
  totalDistanceKm?: number;
  totalHoursDriven?: number;
  averageRating?: number;
  safetyScorePercent?: number;
  tripsToday?: number;
  tripsCompleted?: number;
  passengersTransported?: number;
  distanceTravelledKm?: number;
  averageTripTimeMinutes?: number;
  onTimePerformancePercent?: number;
}

export interface DriverTodaySchedule {
  shiftStartTime: string;
  shiftEndTime: string;
  nextTripTime?: string;
  routeName?: string;
  pickupPoint?: string;
}

export interface DriverActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Driver {
  id: string;
  driverId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  licenseNumber: string;
  licenseExpiry: string; // YYYY-MM-DD
  dateOfBirth?: string;
  address?: string;
  experienceYears: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  availability: 'ON_DUTY' | 'OFF_DUTY' | 'ON_TRIP' | 'BREAK';
  createdAt: string;
  assignedShuttle?: DriverAssignedShuttle;
  assignedRoute?: DriverAssignedRoute;
  emergencyContact?: DriverEmergencyContact;
  attendanceSummary?: DriverAttendanceSummary;
  tripStatistics?: DriverTripStatistics;
  todaySchedule?: DriverTodaySchedule;
  recentActivity?: DriverActivityLog[];
}

export interface CreateDriverPayload {
  driverId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth?: string;
  address?: string;
  experienceYears: number;
  status: 'ACTIVE' | 'INACTIVE';
  availability: 'ON_DUTY' | 'OFF_DUTY';
  emergencyContact?: DriverEmergencyContact;
  assignedShuttleId?: string;
  assignedRouteId?: string;
  password?: string;
  confirmPassword?: string;
}

export interface DriverFilterOptions {
  searchQuery: string;
  statusFilter: string; // 'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  availabilityFilter: string; // 'ALL' | 'ON_DUTY' | 'OFF_DUTY' | 'ON_TRIP' | 'BREAK'
  shuttleFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
  routeFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
  licenseExpiryFilter: string; // 'ALL' | 'EXPIRED' | 'EXPIRING_SOON' | 'VALID'
}

export interface ShuttleFilterOptions {
  searchQuery: string;
  statusFilter: string; // 'ALL' | 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE' | 'DELAYED'
  capacityFilter: string; // 'ALL' | '10-15' | '16-25' | '26+'
  vehicleTypeFilter: string; // 'ALL' | 'Electric Bus' | 'Sprinter Van' | 'Minivan' | 'Coach Bus'
  driverFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
  routeFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
  fuelTypeFilter?: string;
}

export interface ShuttleAssignedDriver {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface ShuttleAssignedRouteInfo {
  id: string;
  code: string;
  name: string;
  totalStops: number;
}

export interface ShuttleMaintenanceInfo {
  lastServiceDate: string;
  nextServiceDueDate: string;
  healthScorePercent: number;
  openIssuesCount: number;
  notes?: string;
}

export interface ShuttleDetailItem {
  id: string;
  vehicleNumber: string;
  vehicleType: string; // e.g. "Sprinter Van", "Electric Bus"
  manufacturer: string; // e.g. "Mercedes-Benz", "BYD", "Ford"
  model: string; // e.g. "Sprinter 2500", "BYD K9"
  capacity: number;
  totalSeats?: number;
  availableSeats?: number;
  bookedSeats?: number;
  occupancy: number;
  fuelType?: 'Electric' | 'Diesel' | 'Hybrid' | 'Gasoline';
  fuelLevelPercent?: number;
  registrationNumber: string;
  registrationDate: string;
  status: 'ACTIVE' | 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE' | 'DELAYED';
  assignedDriver?: ShuttleAssignedDriver;
  assignedRoute?: ShuttleAssignedRouteInfo;
  maintenanceInfo?: ShuttleMaintenanceInfo;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  lastUpdated: string;
  notes?: string;
  color?: string;
}

export interface CreateShuttlePayload {
  vehicleNumber: string;
  vehicleType: string;
  manufacturer: string;
  model: string;
  capacity: number;
  fuelType?: 'Electric' | 'Diesel' | 'Hybrid' | 'Gasoline';
  registrationNumber: string;
  registrationDate: string;
  color?: string;
  status: 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE';
  notes?: string;
  assignedDriverId?: string;
  assignedRouteId?: string;
}

export interface UpdateShuttlePayload extends Partial<CreateShuttlePayload> {
  id: string;
}

export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'CLOSED';

export interface RouteStopDetail {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  sequenceOrder: number;
  scheduledTime: string;
  passengerBoardingCount: number;
  passengerAlightingCount: number;
}

export interface RouteAssignedShuttleInfo {
  id: string;
  vehicleNumber: string;
  model?: string;
  capacity?: number;
  status?: string;
}

export interface RouteAssignedDriverInfo {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface RouteScheduleItem {
  id: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  activeShuttleNumber: string;
}

export interface RouteActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface RouteLocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface RouteDetailItem {
  id: string;
  code: string;
  name: string;
  description: string;
  startPoint: RouteLocationPoint;
  destination: RouteLocationPoint;
  totalStops: number;
  stops: RouteStopDetail[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  assignedShuttle?: RouteAssignedShuttleInfo;
  assignedDriver?: RouteAssignedDriverInfo;
  status: RouteStatus;
  createdDate: string;
  schedules?: RouteScheduleItem[];
  recentActivity?: RouteActivityLogItem[];
  dailyRidership: number;
  driverId?: string;
  driverName?: string;
}

export interface RouteFilterOptions {
  searchQuery: string;
  statusFilter: string; // 'ALL' | 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'CLOSED'
  assignedShuttleFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
  distanceFilter: string; // 'ALL' | '0-10' | '10-25' | '25+'
  stopsFilter: string; // 'ALL' | '1-5' | '6-10' | '10+'
}

export interface CreateRoutePayload {
  name: string;
  description?: string;
  startPoint: RouteLocationPoint;
  destination: RouteLocationPoint;
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  stops?: RouteStopDetail[];
  assignedShuttleId?: string;
  assignedDriverId?: string;
  status: RouteStatus;
  driverId?: string;
}

export interface UpdateRoutePayload extends Partial<CreateRoutePayload> {
  id: string;
}

export interface AdminDashboardData {
  metrics: DashboardMetrics;
  bookingTrend: BookingTrendItem[];
  attendanceTrend: AttendanceTrendItem[];
  fleetUsage: FleetUsageItem[];
  routeDistribution: RouteDistributionItem[];
  monthlyActivity: MonthlyActivityItem[];
  recentActivities: ActivityLogItem[];
  liveTracking: LiveTrackingVehicle[];
  notifications: AppNotification[];
}

export type StopStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'CLOSED';

export interface StopAssignedRouteInfo {
  id: string;
  code: string;
  name: string;
  status: string;
  direction?: string;
}

export interface StopScheduleInfo {
  id: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  shuttleNumber: string;
}

export interface StopActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface StopDetailItem {
  id: string;
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  landmark: string;
  city: string;
  zone: string;
  description: string;
  status: StopStatus;
  routesAssigned: StopAssignedRouteInfo[];
  schedules: StopScheduleInfo[];
  dailyTrafficCount: number;
  createdDate: string;
  recentActivity: StopActivityLogItem[];
}

export interface StopFilterOptions {
  searchQuery: string;
  statusFilter: string; // 'ALL' | 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'CLOSED'
  cityFilter: string; // 'ALL' | 'San Francisco' | 'San Mateo' | 'Palo Alto' | 'Fremont'
  zoneFilter: string; // 'ALL' | 'Zone A - Downtown' | 'Zone B - Tech Corridor' | 'Zone C - Airport/Transit'
  routesAssignedFilter: string; // 'ALL' | 'ASSIGNED' | 'UNASSIGNED'
}

export interface CreateStopPayload {
  name: string;
  address: string;
  lat: number;
  lng: number;
  landmark?: string;
  city: string;
  zone: string;
  description?: string;
  status: StopStatus;
}

export interface UpdateStopPayload extends Partial<CreateStopPayload> {
  id: string;
}

export interface AssignedRouteStop {
  id: string; // Assignment unique ID
  stopId: string;
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  landmark: string;
  city: string;
  zone: string;
  sequenceOrder: number;
  estimatedArrivalMinutes: number; // Offset in minutes from departure
  travelTimeFromPrevMinutes: number; // Distance/time from previous stop
  distanceFromPrevKm: number;
  status: StopStatus;
  passengerBoardingCount: number;
  passengerAlightingCount: number;
  scheduledTime?: string;
}

export interface AssignStopToRoutePayload {
  routeId: string;
  stopId: string;
  sequenceOrder?: number;
  estimatedArrivalMinutes?: number;
  travelTimeFromPrevMinutes?: number;
  distanceFromPrevKm?: number;
}

export interface ReorderRouteStopsPayload {
  routeId: string;
  stopIdsInOrder: string[];
}

export type ScheduleStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'DELAYED' | 'ACTIVE' | 'UPCOMING';
export type ScheduleShift = 'MORNING' | 'EVENING' | 'ALL_DAY';
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface ScheduleActivityItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface ScheduleItem {
  id: string;
  code: string;
  routeId: string;
  routeName: string;
  routeCode: string;
  startLocation: string;
  endLocation: string;
  shuttleId: string;
  shuttleNumber: string;
  shuttleModel: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  departureTime: string; // e.g. "07:30 AM"
  arrivalTime: string;   // e.g. "08:25 AM"
  startDate?: string;
  endDate?: string;
  trackingEnabled?: boolean;
  durationMinutes: number;
  bufferTimeMinutes: number;
  operatingDays: DayOfWeek[];
  shift: ScheduleShift;
  status: ScheduleStatus;
  createdDate: string;
  estimatedStopsCount: number;
  conflictWarnings?: string[];
  recentActivity?: ScheduleActivityItem[];
}

export interface ScheduleFilterOptions {
  searchQuery?: string;
  routeFilter?: string;
  driverFilter?: string;
  vehicleFilter?: string;
  operatingDayFilter?: string;
  statusFilter?: string;
  shiftFilter?: string;
}

export interface CreateSchedulePayload {
  routeId: string;
  shuttleId: string;
  driverId: string;
  startDate?: string;
  endDate?: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  bufferTimeMinutes: number;
  operatingDays: DayOfWeek[];
  shift?: ScheduleShift;
  status?: ScheduleStatus;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  id: string;
}

export interface BookingDetailItem {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeDepartment: string;
  employeeAvatar?: string;
  routeId: string;
  routeName: string;
  routeCode: string;
  shuttleId: string;
  shuttleNumber: string;
  driverId: string;
  driverName: string;
  pickupStopId: string;
  pickupStopName: string;
  dropStopId: string;
  dropStopName: string;
  seatNumber: string;
  transportChargeInr?: number;
  bookingDate: string;
  travelDate: string;
  pickupTime: string;
  dropTime: string;
  bookingStatus: BookingStatus;
  createdTime: string;
  notes?: string;
}

export interface BookingFilterOptions {
  searchQuery?: string;
  bookingStatusFilter?: string;
  travelDateFilter?: string;
  driverFilter?: string;
  vehicleFilter?: string;
  routeFilter?: string;
  pickupStopFilter?: string;
  dropStopFilter?: string;
}

export interface CreateBookingPayload {
  employeeId: string;
  scheduleId?: string;
  routeId: string;
  shuttleId?: string;
  driverId?: string;
  travelDate: string;
  pickupStopId: string;
  dropStopId: string;
  seatNumber?: string;
  notes?: string;
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  id: string;
  bookingStatus?: BookingStatus;
}

export type TripStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'AT_STOP' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';
export type PassengerBoardingStatus = 'WAITING' | 'BOARDED' | 'DROPPED' | 'NO_SHOW';

export interface TripPassenger {
  id: string;
  bookingCode: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  pickupStopName: string;
  dropStopName: string;
  bookingStatus: string;
  boardingStatus: PassengerBoardingStatus;
}

export interface TripStopItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  estimatedArrival?: string;
  actualArrival?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface LiveTripItem {
  id: string;
  code?: string;
  routeId?: string;
  routeName: string;
  shuttleId?: string;
  shuttleNumber: string;
  vehicleModel?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation?: { lat: number; lng: number };
  lat?: number;
  lng?: number;
  heading?: number;
  currentSpeedKmh?: number;
  currentStopName?: string;
  currentStop?: TripStopItem;
  nextStop?: TripStopItem;
  stops?: TripStopItem[];
  passengers?: TripPassenger[];
  status?: TripStatus;
  distanceRemainingKm?: number;
  etaMinutes?: number;
  progressPercentage?: number;
  occupancyCurrent?: number;
  occupancyCapacity?: number;
  delayMinutes?: number;
  startTime?: string;
  endTime?: string;
}

export interface TripHistoryItem {
  id: string;
  code: string;
  routeName: string;
  shuttleNumber: string;
  driverName: string;
  date: string;
  distanceKm: number;
  durationMinutes: number;
  totalPassengers: number;
  status: TripStatus;
}

export interface TripFilterOptions {
  searchQuery?: string;
  statusFilter?: string;
  routeFilter?: string;
  vehicleFilter?: string;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  homeAddress?: string;
  preferredPickupStopId?: string;
  preferredPickupStopName?: string;
  preferredDropStopId?: string;
  preferredDropStopName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    tripReminders: boolean;
    scheduleChanges: boolean;
  };
}

export interface CommuteAnalytics {
  tripsThisMonth?: number;
  totalTripsMonth?: number;
  totalDistanceKm?: number;
  averageTravelTimeMinutes?: number;
  averageTimeMins?: number;
  completedTrips?: number;
  upcomingTrips?: number;
  cancelledTrips?: number;
  savedExpenseUSD?: number;
  carbonSavedKg?: number;
  onTimeArrivalPercentage?: number;
}

export interface DriverProfile {
  id: string;
  driverId: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicle: string;
  assignedVehicleReg: string;
  experienceYears: number;
  rating: number;
  avatarUrl?: string;
  status: 'ON_DUTY' | 'OFF_DUTY' | 'IN_TRANSIT' | 'BREAK';
}

export interface UserApprovalRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  department?: string;
  employeeIdOrDriverId: string;
  registrationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface UserApprovalFilterOptions {
  searchQuery?: string;
  roleFilter?: string;
  statusFilter?: string;
  departmentFilter?: string;
}

export interface TransportExpenseReportItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  totalTrips: number;
  subsidizedCostINR: number;
  employeeOutofPocketINR: number;
  status: 'APPROVED' | 'PENDING';
  distanceTravelledKm?: number;
  avgCostPerTripInr?: number;
  recentTrips?: {
    id: string;
    date: string;
    routeName: string;
    pickupStop: string;
    dropStop: string;
    valueINR: number;
    status: string;
  }[];
}

export interface OrganizationExpenseSummary {
  currentMonthName: string;
  totalExpenseINR: number;
  previousMonthExpenseINR: number;
  monthlyGrowthPercent: number;
  budgetAllocatedINR: number;
  budgetUtilizationPercent: number;
  totalTripsCompleted: number;
  averageCostPerTripINR: number;
  departmentBreakdown: {
    department: string;
    expenseINR: number;
    tripCount: number;
    percentageOfTotal: number;
  }[];
  monthlyTrend: {
    month: string;
    totalINR: number;
    tripCount: number;
  }[];
  totalEmployeesCount?: number;
  totalTripsCount?: number;
  totalOrganizationExpenseUsd?: number;
  avgCostPerEmployeeUsd?: number;
}

export interface EmployeePersonalExpenses {
  employeeId: string;
  employeeName: string;
  currentMonth: string;
  totalTripsThisMonth: number;
  totalSubsidizedINR: number;
  taxExemptBenefitINR: number;
  monthlyLimitINR: number;
  limitUtilizationPercent: number;
  recentTrips: {
    date: string;
    routeName: string;
    pickupStop: string;
    dropStop: string;
    valueINR: number;
    status: string;
  }[];
  currentMonthExpenseUsd?: number;
  previousMonthExpenseUsd?: number;
  averageTripsPerWeek?: number;
  monthlyDistanceKm?: number;
  averageCostPerTripUsd?: number;
  expenseTrend?: { month: string; expenseInr: number; tripsCount: number }[];
}

// Complaint & Support Management Types
export type ComplaintCategory =
  | 'Vehicle Issue'
  | 'Driver Behaviour'
  | 'Employee Behaviour'
  | 'Route Issue'
  | 'Delay'
  | 'Maintenance'
  | 'Safety'
  | 'Suggestion'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Pending' | 'Open' | 'Assigned' | 'In Progress' | 'Processing' | 'Completed' | 'Resolved' | 'Closed';

export interface ComplaintTimelineItem {
  id: string;
  action: string;
  performedBy: string;
  role: Role;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  complaintRef: string;
  subject: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  description: string;
  raisedBy: string;
  raisedById: string;
  role: 'EMPLOYEE' | 'DRIVER';
  department?: string;
  vehicleNumber?: string;
  routeName?: string;
  assignedTo?: string;
  createdOn: string;
  updatedOn: string;
  adminResponse?: string;
  adminNotes?: string;
  attachmentName?: string;
  timeline: ComplaintTimelineItem[];
}

export interface CreateComplaintInput {
  subject: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  description: string;
  attachmentName?: string;
}

export type ComplaintFilterOptions = {
  role?: string;
  priority?: string;
  status?: string;
  category?: string;
  searchQuery?: string;
};

// Seat Selection & Interactive Shuttle Layout Types
export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'RESERVED' | 'BLOCKED' | 'UNAVAILABLE' | 'PRIORITY';

export type SeatCategory = 'WINDOW' | 'AISLE' | 'MIDDLE' | 'REAR';

export interface SeatItem {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  status: SeatStatus;
  category: SeatCategory;
  isPriority?: boolean;
  reservedBy?: string;
  featureBadge?: 'WINDOW' | 'EXTRA_LEGROOM' | 'ACCESSIBLE' | 'POPULAR';
}

export interface ShuttleSeatLayout {
  vehicleId: string;
  vehicleNumber: string;
  shuttleName: string;
  driverName: string;
  capacity: number;
  totalRows: number;
  columnsPerRow: number;
  layoutPattern: '2+1' | '2+2' | '1+2' | 'REAR_BENCH'; // 2 seats - Aisle - 2 seats
  driverPosition: 'LEFT' | 'RIGHT';
  entrancePosition: 'RIGHT_FRONT' | 'LEFT_FRONT';
  seats: SeatItem[];
  availableCount: number;
  bookedCount: number;
  reservedCount: number;
  blockedCount: number;
}

export interface SeatBookingPayload {
  routeId: string;
  routeName: string;
  shuttleId: string;
  shuttleNumber: string;
  scheduleId?: string;
  travelDate: string;
  shiftTime: string;
  pickupStopId: string;
  pickupStopName: string;
  dropStopId: string;
  dropStopName: string;
  seatNumber: string;
  seatCategory: SeatCategory;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  employeeEmail?: string;
  notes?: string;
}













