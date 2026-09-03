import apiClient from '../api/axios';
import { BookingDetailItem, Employee, RouteDetailItem } from '../types';
import { employeeService } from './employeeService';
import { routeService } from './routeService';
import { storage } from '../utils/storage';
import {
  TransportExpenseReportItem,
  OrganizationExpenseSummary,
  EmployeePersonalExpenses,
} from '../types';

const mockOrgSummary: any = {
  currentMonthName: 'July 2026',
  totalExpenseUSD: 148250,
  previousMonthExpenseUSD: 142100,
  monthlyGrowthPercent: 4.3,
  budgetAllocatedINR: 160000,
  budgetUtilizationPercent: 92.6,
  totalTripsCompleted: 4820,
  averageCostPerTripUSD: 30.75,
  departmentBreakdown: [
    { department: 'Engineering & Tech', expenseUSD: 52400, tripCount: 1840, percentageOfTotal: 35.3 },
    { department: 'Product Operations', expenseUSD: 31200, tripCount: 1020, percentageOfTotal: 21.0 },
    { department: 'Enterprise Sales', expenseUSD: 28900, tripCount: 910, percentageOfTotal: 19.5 },
    { department: 'Human Resources', expenseUSD: 18500, tripCount: 580, percentageOfTotal: 12.5 },
    { department: 'Finance & Legal', expenseUSD: 17250, tripCount: 470, percentageOfTotal: 11.7 },
  ],
  monthlyTrend: [
    { month: 'Feb 2026', totalUSD: 128000, tripCount: 4100 },
    { month: 'Mar 2026', totalUSD: 134500, tripCount: 4320 },
    { month: 'Apr 2026', totalUSD: 139000, tripCount: 4450 },
    { month: 'May 2026', totalUSD: 141200, tripCount: 4600 },
    { month: 'Jun 2026', totalUSD: 142100, tripCount: 4680 },
    { month: 'Jul 2026', totalUSD: 148250, tripCount: 4820 },
  ],
};

const mockExpenseItems: any[] = [
  {
    id: 'exp-101',
    employeeId: 'EMP-1001',
    employeeName: 'Alexander Wright',
    department: 'Engineering',
    month: 'July 2026',
    totalTrips: 22,
    subsidizedCostUSD: 660,
    employeeOutofPocketUSD: 0,
    status: 'APPROVED',
  },
  {
    id: 'exp-102',
    employeeId: 'EMP-1002',
    employeeName: 'Sophia Rodriguez',
    department: 'Product',
    month: 'July 2026',
    totalTrips: 18,
    subsidizedCostUSD: 540,
    employeeOutofPocketUSD: 0,
    status: 'APPROVED',
  },
  {
    id: 'exp-103',
    employeeId: 'EMP-1003',
    employeeName: 'Marcus Vance',
    department: 'Sales',
    month: 'July 2026',
    totalTrips: 20,
    subsidizedCostUSD: 600,
    employeeOutofPocketUSD: 0,
    status: 'APPROVED',
  },
  {
    id: 'exp-104',
    employeeId: 'EMP-1004',
    employeeName: 'Elena Rostova',
    department: 'Human Resources',
    month: 'July 2026',
    totalTrips: 15,
    subsidizedCostUSD: 450,
    employeeOutofPocketUSD: 0,
    status: 'PENDING',
  },
  {
    id: 'exp-105',
    employeeId: 'EMP-1005',
    employeeName: 'David Chen',
    department: 'Finance',
    month: 'July 2026',
    totalTrips: 24,
    subsidizedCostUSD: 720,
    employeeOutofPocketUSD: 0,
    status: 'APPROVED',
  },
];

const mockPersonalExpense: any = {
  employeeId: 'EMP-1001',
  employeeName: 'Alexander Wright',
  currentMonth: 'July 2026',
  totalTripsThisMonth: 22,
  totalSubsidizedUSD: 660,
  taxExemptBenefitUSD: 660,
  monthlyLimitUSD: 1000,
  limitUtilizationPercent: 66.0,
  recentTrips: [
    { date: '2026-07-22', routeName: 'Outer Ring Road Express', pickupStop: 'Indiranagar Metro', dropStop: 'HQ', valueUSD: 30, status: 'COMPLETED' },
    { date: '2026-07-21', routeName: 'Outer Ring Road Express', pickupStop: 'HQ', dropStop: 'Indiranagar Metro', valueUSD: 30, status: 'COMPLETED' },
    { date: '2026-07-20', routeName: 'Outer Ring Road Express', pickupStop: 'Indiranagar Metro', dropStop: 'HQ', valueUSD: 30, status: 'COMPLETED' },
    { date: '2026-07-19', routeName: 'Outer Ring Road Express', pickupStop: 'HQ', dropStop: 'Indiranagar Metro', valueUSD: 30, status: 'COMPLETED' },
    { date: '2026-07-18', routeName: 'Outer Ring Road Express', pickupStop: 'Indiranagar Metro', dropStop: 'HQ', valueUSD: 30, status: 'COMPLETED' },
  ],
};

const RATE_INR_PER_KM = 7;

const unwrap = <T,>(response: any): T => response.data?.data ?? response.data;

const mapBooking = (booking: any): BookingDetailItem => ({
    id: String(booking.id || ''),
    code: booking.bookingRef || booking.code || String(booking.id || ''),
    employeeId: String(booking.employeeId || ''),
    employeeName: booking.employeeName || '',
    employeeEmail: booking.employeeEmail || '',
    employeeDepartment: booking.employeeDepartment || 'Unassigned',
    routeId: String(booking.routeId || ''),
    routeName: booking.routeName || 'Assigned route',
    routeCode: booking.routeCode || '',
    shuttleId: String(booking.shuttleId || ''),
    shuttleNumber: booking.shuttleNumber || '',
    driverId: String(booking.driverId || ''),
    driverName: booking.driverName || '',
    pickupStopId: String(booking.pickupStopId || ''),
    pickupStopName: booking.pickupStopName || '',
    dropStopId: String(booking.dropStopId || ''),
    dropStopName: String(booking.dropStopName || ''),
    seatNumber: booking.seatNumber != null ? String(booking.seatNumber) : '',
    transportChargeInr: Number(booking.transportChargeInr ?? 0),
    bookingDate: booking.bookingDate || '',
    travelDate: booking.travelDate || '',
    pickupTime: booking.pickupTime || '',
    dropTime: booking.dropTime || '',
    bookingStatus: booking.status === 'BOOKED' ? 'APPROVED' : booking.status || booking.bookingStatus || 'PENDING',
    createdTime: booking.createdTime || '',
  });

const getExpenseSource = async (): Promise<{ bookings: BookingDetailItem[]; employees: Employee[]; routes: RouteDetailItem[] }> => {
  const [bookingResponse, employees, routes] = await Promise.all([
    apiClient.get('/bookings'),
    employeeService.getEmployees(),
    routeService.getRoutes().catch(() => []),
  ]);
  const response = bookingResponse;
  const rawBookings = unwrap<any>(response);
  if (!Array.isArray(rawBookings)) {
    throw new Error('The bookings API returned an invalid response.');
  }

  return { bookings: rawBookings.map(mapBooking), employees, routes };
};

const getBookingDate = (booking: BookingDetailItem) => booking.travelDate || booking.bookingDate || '';

const isChargeableBooking = (booking: BookingDetailItem) =>
  ['APPROVED', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED'].includes(String(booking.bookingStatus).toUpperCase());

const buildExpenseReports = (bookings: BookingDetailItem[], employees: Employee[] = [], routes: RouteDetailItem[] = []): TransportExpenseReportItem[] => {
  const grouped = new Map<string, TransportExpenseReportItem>();
  const routeDistanceById = new Map(routes.map((route) => [String(route.id), Number(route.totalDistanceKm || 0)]));

  employees.forEach((employee) => {
    grouped.set(String(employee.id), {
      id: `expense-${employee.id}`,
      employeeId: employee.employeeId || String(employee.id),
      employeeName: employee.name || `${employee.firstName} ${employee.lastName}`.trim(),
      department: employee.department || 'Unassigned',
      month: 'All periods',
      totalTrips: 0,
      subsidizedCostINR: 0,
      employeeOutofPocketINR: 0,
      status: 'APPROVED',
      distanceTravelledKm: 0,
      avgCostPerTripInr: 0,
      recentTrips: [],
    });
  });

  bookings.filter(isChargeableBooking).forEach((booking) => {
    const employeeKey = booking.employeeId || booking.employeeEmail || booking.id;
    const employee = employees.find((item) => String(item.id) === employeeKey || item.employeeId === employeeKey || item.email === booking.employeeEmail);
    const employeeId = employee ? String(employee.id) : employeeKey;
    const current = grouped.get(employeeId) || {
      id: `expense-${employeeId}`,
      employeeId,
      employeeName: employee?.name || booking.employeeName || 'Unknown employee',
      department: employee?.department || booking.employeeDepartment || 'Unassigned',
      month: 'All periods',
      totalTrips: 0,
      subsidizedCostINR: 0,
      employeeOutofPocketINR: 0,
      status: 'APPROVED' as const,
      distanceTravelledKm: 0,
      avgCostPerTripInr: 0,
      recentTrips: [],
    };

    current.totalTrips += 1;
    const routeDistanceKm = routeDistanceById.get(booking.routeId) || 0;
    const tripCharge = Number(booking.transportChargeInr || routeDistanceKm * RATE_INR_PER_KM);
    current.subsidizedCostINR += tripCharge;
    current.distanceTravelledKm = (current.distanceTravelledKm || 0) + routeDistanceKm;
    current.recentTrips?.push({
      id: booking.id,
      date: getBookingDate(booking),
      routeName: booking.routeName,
      pickupStop: booking.pickupStopName,
      dropStop: booking.dropStopName,
      valueINR: tripCharge,
      status: booking.bookingStatus,
    });
    grouped.set(employeeId, current);
  });

  return Array.from(grouped.values()).map((report) => ({
    ...report,
    avgCostPerTripInr: report.totalTrips ? report.subsidizedCostINR / report.totalTrips : 0,
    recentTrips: report.recentTrips?.sort((a, b) => b.date.localeCompare(a.date)),
  }));
};

const buildSummary = (reports: TransportExpenseReportItem[]): OrganizationExpenseSummary => {
  const totalExpenseINR = reports.reduce((sum, report) => sum + report.subsidizedCostINR, 0);
  const totalTripsCompleted = reports.reduce((sum, report) => sum + report.totalTrips, 0);
  const departmentMap = new Map<string, { expenseINR: number; tripCount: number }>();
  const monthMap = new Map<string, { totalINR: number; tripCount: number }>();
  reports.forEach((report) => {
    const current = departmentMap.get(report.department) || { expenseINR: 0, tripCount: 0 };
    current.expenseINR += report.subsidizedCostINR;
    current.tripCount += report.totalTrips;
    departmentMap.set(report.department, current);
    report.recentTrips?.forEach((trip) => {
      const monthKey = trip.date.slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(monthKey)) return;
      const month = monthMap.get(monthKey) || { totalINR: 0, tripCount: 0 };
      month.totalINR += trip.valueINR;
      month.tripCount += 1;
      monthMap.set(monthKey, month);
    });
  });

  return {
    currentMonthName: 'All periods',
    totalExpenseINR,
    previousMonthExpenseINR: 0,
    monthlyGrowthPercent: 0,
    budgetAllocatedINR: 0,
    budgetUtilizationPercent: 0,
    totalTripsCompleted,
    averageCostPerTripINR: totalTripsCompleted ? totalExpenseINR / totalTripsCompleted : 0,
    departmentBreakdown: Array.from(departmentMap.entries()).map(([department, values]) => ({
      department,
      ...values,
      percentageOfTotal: totalExpenseINR ? (values.expenseINR / totalExpenseINR) * 100 : 0,
    })),
    monthlyTrend: Array.from(monthMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([month, values]) => ({ month, ...values })),
    totalEmployeesCount: reports.length,
  };
};

export const expenseService = {
  /**
   * GET /api/v1/admin/expenses/summary
   */
  getOrganizationExpenseSummary: async (): Promise<OrganizationExpenseSummary> => {
    const source = await getExpenseSource();
    return buildSummary(buildExpenseReports(source.bookings, source.employees, source.routes));
  },

  /**
   * GET /api/v1/admin/expenses/reports
   */
  getExpenseReportItems: async (): Promise<TransportExpenseReportItem[]> => {
    const source = await getExpenseSource();
    return buildExpenseReports(source.bookings, source.employees, source.routes);
  },

  /**
   * GET /api/v1/employee/expenses
   */
  getEmployeePersonalExpenses: async (employeeId?: string): Promise<EmployeePersonalExpenses> => {
    const source = await getExpenseSource();
    const storedUser = storage.get<any>('offgo_auth_user', null);
    const requestedId = employeeId || storedUser?.id || storedUser?.employeeId || storedUser?.email;
    const employee = source.employees.find((item) =>
      String(item.id) === requestedId || item.employeeId === requestedId || item.email?.toLowerCase() === String(requestedId || '').toLowerCase());
    const reports = buildExpenseReports(source.bookings, source.employees, source.routes);
    const report = reports.find((item) => item.employeeId === employee?.employeeId || item.employeeId === requestedId);
    const recentTrips = report?.recentTrips || [];
    const totalSubsidizedINR = report?.subsidizedCostINR || 0;
    const totalTripsThisMonth = report?.totalTrips || 0;
    const expenseTrend = recentTrips.reduce<{ month: string; expenseInr: number; tripsCount: number }[]>((trend, trip) => {
      const month = trip.date.slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(month)) return trend;
      const existing = trend.find((item) => item.month === month);
      if (existing) {
        existing.expenseInr += trip.valueINR;
        existing.tripsCount += 1;
      } else {
        trend.push({ month, expenseInr: trip.valueINR, tripsCount: 1 });
      }
      return trend;
    }, []).sort((a, b) => a.month.localeCompare(b.month));

    return {
      employeeId: employee?.employeeId || requestedId || '',
      employeeName: employee?.name || report?.employeeName || 'Employee',
      currentMonth: new Date().toISOString().slice(0, 7),
      totalTripsThisMonth,
      totalSubsidizedINR,
      taxExemptBenefitINR: totalSubsidizedINR,
      monthlyLimitINR: 0,
      limitUtilizationPercent: 0,
      recentTrips: recentTrips.map((trip) => ({ ...trip })),
      expenseTrend,
      averageCostPerTripInr: totalTripsThisMonth ? totalSubsidizedINR / totalTripsThisMonth : 0,
    };
  },
};
