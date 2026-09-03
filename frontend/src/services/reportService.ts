import {
  ReportType,
  ReportFilterOptions,
  ReportMeta,
  ReportDataPayload,
  ReportHistoryItem,
  ReportsStats,
} from '../types/reports';

export const AVAILABLE_REPORTS_LIST: ReportMeta[] = [
  {
    id: 'EMPLOYEE_TRANSPORT',
    title: 'Employee Transport Report',
    category: 'HR_TRAVEL',
    description: 'Comprehensive roster of employees, assigned routes, pickup/drop stops, seat allocations, and travel frequency.',
    iconName: 'Users',
    badge: 'HR & Operations',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    estimatedPages: 4,
  },
  {
    id: 'EMPLOYEE_TRAVEL_HISTORY',
    title: 'Employee Travel History Report',
    category: 'HR_TRAVEL',
    description: 'Detailed log of individual employee commutes, seat numbers, distance traveled, and trip status records.',
    iconName: 'History',
    badge: 'Audit & Log',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    estimatedPages: 6,
  },
  {
    id: 'MONTHLY_EXPENSE',
    title: 'Monthly Transport Expense Report',
    category: 'FINANCIAL',
    description: 'Financial ledger breaking down costs by employee, department, distance, and per-trip averages.',
    iconName: 'DollarSign',
    badge: 'Finance & Tax',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    estimatedPages: 5,
  },
  {
    id: 'FLEET_UTILIZATION',
    title: 'Fleet Utilization Report',
    category: 'OPERATIONAL',
    description: 'Shuttle vehicle performance stats including distance covered, running hours, idle duration, and occupancy rates.',
    iconName: 'Bus',
    badge: 'Fleet Ops',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    estimatedPages: 3,
  },
  {
    id: 'DRIVER_PERFORMANCE',
    title: 'Driver Performance Report',
    category: 'OPERATIONAL',
    description: 'Driver metrics covering completed trips, routes, on-time score, working hours, and safety ratings.',
    iconName: 'UserCheck',
    badge: 'Safety & HR',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    estimatedPages: 3,
  },
  {
    id: 'TRIP_ANALYTICS',
    title: 'Trip Analytics Report',
    category: 'OPERATIONAL',
    description: 'Macro operational view on total vs cancelled trips, peak hour spikes, average duration, and seat fill ratios.',
    iconName: 'BarChart3',
    badge: 'Analytics',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    estimatedPages: 4,
  },
  {
    id: 'ROUTE_ANALYTICS',
    title: 'Route Analytics Report',
    category: 'OPERATIONAL',
    description: 'Route efficiency metrics including passenger volume per stop, average occupancy, distance, and travel time.',
    iconName: 'GitMerge',
    badge: 'Routing Ops',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    estimatedPages: 4,
  },
  {
    id: 'DEPARTMENT_USAGE',
    title: 'Department-wise Usage Report',
    category: 'FINANCIAL',
    description: 'Departmental breakdown of active employees, monthly trips, total budget consumption, and usage ratios.',
    iconName: 'Building2',
    badge: 'Executive',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    estimatedPages: 2,
  },
  {
    id: 'COMPLAINT_SUPPORT',
    title: 'Complaint & Support Report',
    category: 'COMPLIANCE',
    description: 'Helpdesk SLA analysis covering open, resolved, and pending tickets, priority categories, and resolution times.',
    iconName: 'AlertCircle',
    badge: 'Support SLA',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    estimatedPages: 3,
  },
  {
    id: 'OPERATIONAL_SUMMARY',
    title: 'Operational Summary Report',
    category: 'OPERATIONAL',
    description: 'Executive overview combining active vehicles, drivers, transported staff, running routes, and health scores.',
    iconName: 'Activity',
    badge: 'Executive C-Suite',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    estimatedPages: 5,
  },
];

let reportHistoryStore: ReportHistoryItem[] = [
  {
    id: 'RPT-901',
    reportType: 'MONTHLY_EXPENSE',
    title: 'Monthly Transport Expense Report - July 2026',
    generatedBy: 'Sarah Jenkins (Chief Ops)',
    generatedAt: '2026-07-23 04:15 AM',
    downloadedCount: 14,
    lastDownloadedAt: '2026-07-23 05:00 AM',
    fileTypes: ['PDF', 'EXCEL', 'CSV'],
    status: 'READY',
    recordCount: 128,
  },
  {
    id: 'RPT-902',
    reportType: 'FLEET_UTILIZATION',
    title: 'Fleet Utilization & Maintenance Report - Q2 2026',
    generatedBy: 'Sarah Jenkins (Chief Ops)',
    generatedAt: '2026-07-22 18:30 PM',
    downloadedCount: 8,
    lastDownloadedAt: '2026-07-22 19:10 PM',
    fileTypes: ['PDF', 'EXCEL'],
    status: 'READY',
    recordCount: 42,
  },
  {
    id: 'RPT-903',
    reportType: 'EMPLOYEE_TRANSPORT',
    title: 'Employee Transport Allocation Roster - Q3 2026',
    generatedBy: 'David Miller (HR Admin)',
    generatedAt: '2026-07-21 11:20 AM',
    downloadedCount: 22,
    lastDownloadedAt: '2026-07-23 02:45 AM',
    fileTypes: ['PDF', 'CSV'],
    status: 'READY',
    recordCount: 310,
  },
  {
    id: 'RPT-904',
    reportType: 'DRIVER_PERFORMANCE',
    title: 'Driver On-Time & Safety Audit Report',
    generatedBy: 'Michael Scott (Fleet Dir)',
    generatedAt: '2026-07-20 09:00 AM',
    downloadedCount: 5,
    lastDownloadedAt: '2026-07-20 10:12 AM',
    fileTypes: ['PDF'],
    status: 'READY',
    recordCount: 18,
  },
];

export const reportService = {
  getStats(): ReportsStats {
    const todayStr = new Date().toISOString().split('T')[0];
    const generatedToday = reportHistoryStore.filter((r) => r.generatedAt.includes(todayStr) || true).length; // mock today
    const totalDownloads = reportHistoryStore.reduce((acc, curr) => acc + curr.downloadedCount, 0);

    return {
      availableReportsCount: AVAILABLE_REPORTS_LIST.length,
      generatedTodayCount: Math.max(generatedToday, 3),
      lastGeneratedTime: reportHistoryStore[0]?.generatedAt || 'Just now',
      totalDownloadedCount: totalDownloads,
    };
  },

  getHistory(): ReportHistoryItem[] {
    return [...reportHistoryStore];
  },

  generateReport(type: ReportType, filters: ReportFilterOptions): ReportDataPayload {
    const meta = AVAILABLE_REPORTS_LIST.find((r) => r.id === type) || AVAILABLE_REPORTS_LIST[0];
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    switch (type) {
      case 'EMPLOYEE_TRANSPORT':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'HR & Employee Route Allocation Audit',
          generatedAt: timestamp,
          generatedBy: 'Admin Console (Sarah Jenkins)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Total Enrolled Employees', value: 342, change: '+12%', trend: 'up' },
            { label: 'Active Assigned Routes', value: 14, change: '100% Covered' },
            { label: 'Avg Seat Reservation Rate', value: '89.4%', change: '+4.2%', trend: 'up' },
            { label: 'Subsidized Commute Cost', value: '$24,800/mo', description: 'Fully Enterprise Sponsored' },
          ],
          chartTitle: 'Employee Commute Volume by Department',
          chartType: 'bar',
          chartData: [
            { name: 'Engineering', employees: 120, trips: 2400 },
            { name: 'Product & Design', employees: 45, trips: 900 },
            { name: 'Operations', employees: 85, trips: 1700 },
            { name: 'Finance & HR', employees: 42, trips: 840 },
            { name: 'Sales & Marketing', employees: 50, trips: 1000 },
          ],
          tableColumns: [
            { key: 'empCode', header: 'Emp Code' },
            { key: 'name', header: 'Employee Name' },
            { key: 'department', header: 'Department' },
            { key: 'route', header: 'Assigned Route' },
            { key: 'pickup', header: 'Pickup Stop' },
            { key: 'drop', header: 'Drop Stop' },
            { key: 'seat', header: 'Seat No.' },
            { key: 'frequency', header: 'Monthly Trips' },
            { key: 'status', header: 'Status' },
          ],
          tableData: [
            { empCode: 'EMP-1001', name: 'Alexander Wright', department: 'Engineering', route: 'Outer Ring Road Ex', pickup: 'Indiranagar Metro', drop: 'Off-Go HQ', seat: '04A', frequency: '22 Trips', status: 'ACTIVE' },
            { empCode: 'EMP-1002', name: 'Sophia Chen', department: 'Product & Design', route: 'Whitefield Corridor', pickup: 'Koramangala Hub', drop: 'ITPL Terminal', seat: '02B', frequency: '20 Trips', status: 'ACTIVE' },
            { empCode: 'EMP-1003', name: 'Marcus Vance', department: 'Operations', route: 'Electronic City Express', pickup: 'Silk Board flyover', drop: 'E-City Phase 1', seat: '05D', frequency: '18 Trips', status: 'ACTIVE' },
            { empCode: 'EMP-1004', name: 'Emily Taylor', department: 'Finance & HR', route: 'Outer Ring Road Ex', pickup: 'Domlur Flyover', drop: 'Off-Go HQ', seat: '01A', frequency: '22 Trips', status: 'ACTIVE' },
            { empCode: 'EMP-1005', name: 'David Miller', department: 'Engineering', route: 'North Bangalore Line', pickup: 'Hebbal Terminal', drop: 'Tech Park East', seat: '03C', frequency: '19 Trips', status: 'ACTIVE' },
            { empCode: 'EMP-1006', name: 'Priya Sharma', department: 'Sales & Marketing', route: 'Outer Ring Road Ex', pickup: 'Marathahalli Junc', drop: 'Off-Go HQ', seat: '06B', frequency: '21 Trips', status: 'ACTIVE' },
          ],
          executiveNotes: [
            '98.2% of employee travel requests were successfully assigned guaranteed seating.',
            'Engineering accounts for the highest transport volume (35% of overall commuter seats).',
            'No route congestion bottlenecks detected on Outer Ring Road during morning shift 2.',
          ],
        };

      case 'EMPLOYEE_TRAVEL_HISTORY':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Individual Trip Logs & Booking Verification History',
          generatedAt: timestamp,
          generatedBy: 'Admin Console (Sarah Jenkins)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Total Logs Recorded', value: '1,420 Trips', change: 'This Month' },
            { label: 'Completed Rate', value: '98.8%', change: '+0.5%', trend: 'up' },
            { label: 'Avg Distance/Trip', value: '16.4 km', description: 'Avg commute length' },
            { label: 'No-Show Rate', value: '1.2%', change: '-0.3%', trend: 'down' },
          ],
          chartTitle: 'Trip Completion vs Cancellation Trend (Past 7 Days)',
          chartType: 'area',
          chartData: [
            { name: 'Mon', completed: 210, cancelled: 3 },
            { name: 'Tue', completed: 225, cancelled: 2 },
            { name: 'Wed', completed: 240, cancelled: 1 },
            { name: 'Thu', completed: 235, cancelled: 4 },
            { name: 'Fri', completed: 220, cancelled: 2 },
            { name: 'Sat', completed: 80, cancelled: 0 },
            { name: 'Sun', completed: 40, cancelled: 0 },
          ],
          tableColumns: [
            { key: 'tripId', header: 'Trip ID' },
            { key: 'date', header: 'Trip Date' },
            { key: 'employee', header: 'Employee' },
            { key: 'route', header: 'Route' },
            { key: 'vehicle', header: 'Vehicle' },
            { key: 'driver', header: 'Driver' },
            { key: 'seat', header: 'Seat' },
            { key: 'distance', header: 'Distance' },
            { key: 'status', header: 'Status' },
          ],
          tableData: [
            { tripId: 'TRP-8801', date: '2026-07-23 08:30 AM', employee: 'Alexander Wright', route: 'Outer Ring Road Ex', vehicle: 'OFF-GO-101', driver: 'David Miller', seat: '04A', distance: '18.2 km', status: 'COMPLETED' },
            { tripId: 'TRP-8802', date: '2026-07-23 08:30 AM', employee: 'Sophia Chen', route: 'Whitefield Corridor', vehicle: 'OFF-GO-104', driver: 'Robert Thorne', seat: '02B', distance: '14.5 km', status: 'COMPLETED' },
            { tripId: 'TRP-8803', date: '2026-07-22 05:30 PM', employee: 'Marcus Vance', route: 'Electronic City Ex', vehicle: 'OFF-GO-108', driver: 'Elena Rostova', seat: '05D', distance: '22.0 km', status: 'COMPLETED' },
            { tripId: 'TRP-8804', date: '2026-07-22 08:30 AM', employee: 'Emily Taylor', route: 'Outer Ring Road Ex', vehicle: 'OFF-GO-101', driver: 'David Miller', seat: '01A', distance: '18.2 km', status: 'COMPLETED' },
            { tripId: 'TRP-8805', date: '2026-07-21 09:30 AM', employee: 'David Miller', route: 'North Bangalore Line', vehicle: 'OFF-GO-112', driver: 'James Wilson', seat: '03C', distance: '12.8 km', status: 'NO_SHOW' },
          ],
          executiveNotes: [
            'All completed trip passes were verified upon boarding by vehicle operators.',
            'No-show rates have dropped to an all-time low of 1.2% following automated QR pass reminders.',
          ],
        };

      case 'MONTHLY_EXPENSE':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Financial Transport Cost Breakdown & Department Audit',
          generatedAt: timestamp,
          generatedBy: 'Finance Ops (Sarah Jenkins)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Total Transport Expense', value: '$38,450', change: '+2.1% vs target' },
            { label: 'Avg Cost Per Employee', value: '$112.40/mo', description: 'Budget cap: $150' },
            { label: 'Avg Cost Per Trip', value: '$4.25', change: '-3.8%', trend: 'down' },
            { label: 'Fuel & EV Subsidy Saved', value: '$8,200', description: 'Electric fleet savings' },
          ],
          chartTitle: 'Monthly Expense Trend ($) by Department',
          chartType: 'bar',
          chartData: [
            { name: 'Engineering', expense: 14200, budget: 15000 },
            { name: 'Operations', expense: 9800, budget: 10000 },
            { name: 'Sales & Mktg', expense: 6200, budget: 7000 },
            { name: 'Product', expense: 5100, budget: 5500 },
            { name: 'Finance & HR', expense: 3150, budget: 3500 },
          ],
          tableColumns: [
            { key: 'department', header: 'Department' },
            { key: 'headcount', header: 'Commuters' },
            { key: 'totalTrips', header: 'Total Trips' },
            { key: 'distanceKm', header: 'Distance (km)' },
            { key: 'avgCostTrip', header: 'Cost/Trip' },
            { key: 'monthlyCost', header: 'Monthly Cost' },
            { key: 'budgetStatus', header: 'Budget Status' },
          ],
          tableData: [
            { department: 'Engineering', headcount: 120, totalTrips: 3240, distanceKm: '53,136 km', avgCostTrip: '$4.38', monthlyCost: '$14,200', budgetStatus: 'UNDER BUDGET (-5.3%)' },
            { department: 'Operations', headcount: 85, totalTrips: 2295, distanceKm: '37,638 km', avgCostTrip: '$4.27', monthlyCost: '$9,800', budgetStatus: 'UNDER BUDGET (-2.0%)' },
            { department: 'Sales & Marketing', headcount: 50, totalTrips: 1350, distanceKm: '22,140 km', avgCostTrip: '$4.59', monthlyCost: '$6,200', budgetStatus: 'UNDER BUDGET (-11.4%)' },
            { department: 'Product & Design', headcount: 45, totalTrips: 1215, distanceKm: '19,926 km', avgCostTrip: '$4.20', monthlyCost: '$5,100', budgetStatus: 'UNDER BUDGET (-7.2%)' },
            { department: 'Finance & HR', headcount: 42, totalTrips: 756, distanceKm: '12,398 km', avgCostTrip: '$4.16', monthlyCost: '$3,150', budgetStatus: 'UNDER BUDGET (-10.0%)' },
          ],
          executiveNotes: [
            'Overall company transport expenditures remained 6.8% under the pre-approved quarterly ceiling.',
            'EV fleet deployment contributed to an estimated $8,200 reduction in monthly fuel charges.',
          ],
        };

      case 'FLEET_UTILIZATION':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Shuttle Bus Mileage, Running Hours & Occupancy Ratios',
          generatedAt: timestamp,
          generatedBy: 'Fleet Admin (Michael Scott)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Active Fleet Count', value: '18 Vehicles', change: '100% Operational' },
            { label: 'Avg Occupancy Rate', value: '88.6%', change: '+3.1%', trend: 'up' },
            { label: 'Total Mileage Covered', value: '145,230 km', description: 'Cumulative this month' },
            { label: 'Maintenance Uptime', value: '99.4%', change: 'Zero Critical Breakdowns' },
          ],
          chartTitle: 'Vehicle Occupancy Rates (%) across Active Fleet',
          chartType: 'pie',
          chartData: [
            { name: 'Mercedes Sprinter (OFF-GO-101)', value: 92 },
            { name: 'BYD E-Bus (OFF-GO-104)', value: 89 },
            { name: 'Volvo Coach (OFF-GO-108)', value: 85 },
            { name: 'Tata Starbus (OFF-GO-112)', value: 88 },
            { name: 'Isuzu Executive (OFF-GO-115)', value: 91 },
          ],
          tableColumns: [
            { key: 'vehicleNo', header: 'Vehicle No.' },
            { key: 'model', header: 'Vehicle Model' },
            { key: 'tripsCompleted', header: 'Trips Completed' },
            { key: 'distanceKm', header: 'Distance (km)' },
            { key: 'runningHours', header: 'Running Hrs' },
            { key: 'idleMinutes', header: 'Idle Time' },
            { key: 'occupancy', header: 'Avg Occupancy' },
            { key: 'maintStatus', header: 'Status' },
          ],
          tableData: [
            { vehicleNo: 'OFF-GO-101', model: 'Mercedes Sprinter Van 2500', tripsCompleted: 142, distanceKm: '2,584 km', runningHours: '118 hrs', idleMinutes: '14 mins/day', occupancy: '92.5%', maintStatus: 'EXCELLENT' },
            { vehicleNo: 'OFF-GO-104', model: 'BYD K9 Electric Shuttle', tripsCompleted: 138, distanceKm: '2,310 km', runningHours: '112 hrs', idleMinutes: '18 mins/day', occupancy: '89.0%', maintStatus: 'EXCELLENT' },
            { vehicleNo: 'OFF-GO-108', model: 'Volvo B7R Executive Coach', tripsCompleted: 120, distanceKm: '3,120 km', runningHours: '145 hrs', idleMinutes: '22 mins/day', occupancy: '85.4%', maintStatus: 'SERVICE DUE' },
            { vehicleNo: 'OFF-GO-112', model: 'Tata Starbus EV', tripsCompleted: 130, distanceKm: '2,100 km', runningHours: '105 hrs', idleMinutes: '12 mins/day', occupancy: '88.2%', maintStatus: 'EXCELLENT' },
            { vehicleNo: 'OFF-GO-115', model: 'Isuzu Executive Van', tripsCompleted: 145, distanceKm: '2,750 km', runningHours: '125 hrs', idleMinutes: '10 mins/day', occupancy: '91.0%', maintStatus: 'EXCELLENT' },
          ],
          executiveNotes: [
            'All 18 active corporate shuttles operated above the target 80% capacity utilization baseline.',
            'OFF-GO-108 is scheduled for preventive brake & battery maintenance on Saturday.',
          ],
        };

      case 'DRIVER_PERFORMANCE':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Driver On-Time Rating, Safety Audit & Hours Log',
          generatedAt: timestamp,
          generatedBy: 'Fleet Admin (Michael Scott)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Active Drivers', value: '18 Drivers', change: 'Full Roster' },
            { label: 'Avg On-Time Arrival', value: '96.8%', change: '+1.4%', trend: 'up' },
            { label: 'Safety Rating', value: '4.92 / 5.0', description: 'Zero Safety Violations' },
            { label: 'Avg Working Hours', value: '7.8 hrs/day', change: 'Within OSHA limits' },
          ],
          chartTitle: 'Driver On-Time Performance Score (%)',
          chartType: 'bar',
          chartData: [
            { name: 'David Miller', score: 98.5, trips: 142 },
            { name: 'Robert Thorne', score: 96.2, trips: 138 },
            { name: 'Elena Rostova', score: 97.8, trips: 120 },
            { name: 'James Wilson', score: 95.0, trips: 130 },
            { name: 'Carlos Gomez', score: 96.8, trips: 145 },
          ],
          tableColumns: [
            { key: 'driverName', header: 'Driver Name' },
            { key: 'assignedVehicle', header: 'Vehicle No.' },
            { key: 'tripsCount', header: 'Trips Completed' },
            { key: 'routesCovered', header: 'Primary Route' },
            { key: 'workHours', header: 'Working Hrs' },
            { key: 'onTimeRate', header: 'On-Time Score' },
            { key: 'avgDuration', header: 'Avg Trip Time' },
            { key: 'rating', header: 'Safety Rating' },
          ],
          tableData: [
            { driverName: 'David Miller', assignedVehicle: 'OFF-GO-101', tripsCount: 142, routesCovered: 'Outer Ring Road Express', workHours: '156 hrs', onTimeRate: '98.5%', avgDuration: '42 mins', rating: '4.95 ⭐' },
            { driverName: 'Robert Thorne', assignedVehicle: 'OFF-GO-104', tripsCount: 138, routesCovered: 'Whitefield Corridor', workHours: '150 hrs', onTimeRate: '96.2%', avgDuration: '38 mins', rating: '4.90 ⭐' },
            { driverName: 'Elena Rostova', assignedVehicle: 'OFF-GO-108', tripsCount: 120, routesCovered: 'Electronic City Express', workHours: '162 hrs', onTimeRate: '97.8%', avgDuration: '52 mins', rating: '4.98 ⭐' },
            { driverName: 'James Wilson', assignedVehicle: 'OFF-GO-112', tripsCount: 130, routesCovered: 'North Bangalore Line', workHours: '144 hrs', onTimeRate: '95.0%', avgDuration: '35 mins', rating: '4.88 ⭐' },
            { driverName: 'Carlos Gomez', assignedVehicle: 'OFF-GO-115', tripsCount: 145, routesCovered: 'Airport Direct Shuttle', workHours: '158 hrs', onTimeRate: '96.8%', avgDuration: '48 mins', rating: '4.92 ⭐' },
          ],
          executiveNotes: [
            'Driver David Miller achieved the highest on-time score (98.5%) for 3 consecutive months.',
            'Zero traffic infractions or passenger safety complaints logged during this evaluation window.',
          ],
        };

      case 'TRIP_ANALYTICS':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Macro Commute Volume, Cancellation Rates & Peak Hour Demand',
          generatedAt: timestamp,
          generatedBy: 'Analytics System (AI Engine)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Total Scheduled Trips', value: '1,450 Trips', change: '100% Executed' },
            { label: 'Completed Trips', value: '1,432 Trips', change: '98.8% Success' },
            { label: 'Cancelled Trips', value: '18 Trips', change: '1.2% Cancel Rate', trend: 'down' },
            { label: 'Peak Hour Load Ratio', value: '94.2%', description: '08:00 - 09:30 AM Peak' },
          ],
          chartTitle: 'Trip Hourly Demand Profile (Passengers per Hour)',
          chartType: 'line',
          chartData: [
            { name: '07:00 AM', passengers: 120 },
            { name: '08:00 AM', passengers: 340 },
            { name: '09:00 AM', passengers: 420 },
            { name: '10:00 AM', passengers: 180 },
            { name: '04:00 PM', passengers: 150 },
            { name: '05:00 PM', passengers: 380 },
            { name: '06:00 PM', passengers: 410 },
            { name: '07:00 PM', passengers: 210 },
          ],
          tableColumns: [
            { key: 'shiftSlot', header: 'Shift Time Slot' },
            { key: 'totalBookings', header: 'Bookings' },
            { key: 'completed', header: 'Completed' },
            { key: 'cancelled', header: 'Cancelled' },
            { key: 'avgOccupancy', header: 'Avg Occupancy' },
            { key: 'avgDuration', header: 'Avg Travel Time' },
          ],
          tableData: [
            { shiftSlot: 'Morning Shift 1 (07:30 AM)', totalBookings: 280, completed: 278, cancelled: 2, avgOccupancy: '85.2%', avgDuration: '38 mins' },
            { shiftSlot: 'Morning Shift 2 (08:30 AM)', totalBookings: 420, completed: 415, cancelled: 5, avgOccupancy: '94.8%', avgDuration: '45 mins' },
            { shiftSlot: 'Morning Shift 3 (09:30 AM)', totalBookings: 210, completed: 208, cancelled: 2, avgOccupancy: '78.5%', avgDuration: '35 mins' },
            { shiftSlot: 'Evening Shift 1 (05:30 PM)', totalBookings: 310, completed: 305, cancelled: 5, avgOccupancy: '91.0%', avgDuration: '48 mins' },
            { shiftSlot: 'Evening Shift 2 (06:30 PM)', totalBookings: 230, completed: 226, cancelled: 4, avgOccupancy: '82.4%', avgDuration: '40 mins' },
          ],
          executiveNotes: [
            'Morning Shift 2 (08:30 AM) represents peak capacity at 94.8% occupancy.',
            'Adding 1 extra shuttle to the 08:30 AM slot is recommended to accommodate growing waitlists.',
          ],
        };

      case 'ROUTE_ANALYTICS':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Route Network Efficiency, Stop Congestion & Distance Audit',
          generatedAt: timestamp,
          generatedBy: 'Analytics System (AI Engine)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Active Routes', value: '8 Express Lines', change: '54 Total Stops' },
            { label: 'Avg Passengers/Route', value: '182 Passengers', change: '+5.4%', trend: 'up' },
            { label: 'Network Distance', value: '312.5 km', description: 'Total route length' },
            { label: 'Avg Route Time', value: '41.2 mins', change: '-2.5 mins', trend: 'down' },
          ],
          chartTitle: 'Average Occupancy (%) by Express Route',
          chartType: 'bar',
          chartData: [
            { name: 'Outer Ring Road Ex', occupancy: 93, passengers: 310 },
            { name: 'Whitefield Tech Line', occupancy: 88, passengers: 240 },
            { name: 'Electronic City Direct', occupancy: 86, passengers: 210 },
            { name: 'North Bangalore Ex', occupancy: 82, passengers: 180 },
            { name: 'Airport Corridor', occupancy: 90, passengers: 220 },
          ],
          tableColumns: [
            { key: 'routeName', header: 'Route Name' },
            { key: 'stopsCount', header: 'Stops' },
            { key: 'avgPassengers', header: 'Avg Daily Staff' },
            { key: 'occupancy', header: 'Avg Occupancy' },
            { key: 'distance', header: 'Distance' },
            { key: 'travelTime', header: 'Avg Travel Time' },
            { key: 'efficiency', header: 'Efficiency Rating' },
          ],
          tableData: [
            { routeName: 'Outer Ring Road Express (Silk Board → Hebbal)', stopsCount: 8, avgPassengers: 310, occupancy: '93.2%', distance: '28.5 km', travelTime: '42 mins', efficiency: 'HIGH (96%)' },
            { routeName: 'Whitefield Tech Corridor (Indiranagar → ITPL)', stopsCount: 6, avgPassengers: 240, occupancy: '88.0%', distance: '22.0 km', travelTime: '38 mins', efficiency: 'OPTIMAL (92%)' },
            { routeName: 'Electronic City Direct (Koramangala → Infosys)', stopsCount: 5, avgPassengers: 210, occupancy: '86.4%', distance: '24.2 km', travelTime: '50 mins', efficiency: 'OPTIMAL (89%)' },
            { routeName: 'North Bangalore Line (Hebbal → Yelahanka)', stopsCount: 7, avgPassengers: 180, occupancy: '82.0%', distance: '19.8 km', travelTime: '32 mins', efficiency: 'OPTIMAL (88%)' },
            { routeName: 'Airport Corridor Shuttle (MG Road → KIA)', stopsCount: 4, avgPassengers: 220, occupancy: '90.5%', distance: '36.0 km', travelTime: '55 mins', efficiency: 'HIGH (94%)' },
          ],
          executiveNotes: [
            'Outer Ring Road Express is the most heavily utilized route in the entire network.',
            'Stops at Indiranagar Metro and Marathahalli Junction experience 60% of all boarding activity.',
          ],
        };

      case 'DEPARTMENT_USAGE':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Departmental Headcount, Monthly Commutes & Budget Consumption',
          generatedAt: timestamp,
          generatedBy: 'Finance & HR (David Miller)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Participating Departments', value: '6 Depts', change: '342 Staff' },
            { label: 'Monthly Trips Completed', value: '8,856 Trips', change: '+3.8%', trend: 'up' },
            { label: 'Monthly Subsidized Expense', value: '$38,450', description: 'Fully Sponsored' },
            { label: 'Highest Share', value: 'Engineering (36.9%)', description: 'Top User Dept' },
          ],
          chartTitle: 'Transport Expense Share (%) by Department',
          chartType: 'pie',
          chartData: [
            { name: 'Engineering', value: 36.9 },
            { name: 'Operations', value: 25.5 },
            { name: 'Sales & Mktg', value: 16.1 },
            { name: 'Product', value: 13.3 },
            { name: 'Finance & HR', value: 8.2 },
          ],
          tableColumns: [
            { key: 'department', header: 'Department' },
            { key: 'registeredStaff', header: 'Active Staff' },
            { key: 'monthlyTrips', header: 'Monthly Trips' },
            { key: 'monthlyCost', header: 'Monthly Cost ($)' },
            { key: 'usageShare', header: 'Usage Share' },
            { key: 'avgCostPerStaff', header: 'Cost / Employee' },
          ],
          tableData: [
            { department: 'Engineering', registeredStaff: 120, monthlyTrips: 3240, monthlyCost: '$14,200', usageShare: '36.9%', avgCostPerStaff: '$118.33' },
            { department: 'Operations', registeredStaff: 85, monthlyTrips: 2295, monthlyCost: '$9,800', usageShare: '25.5%', avgCostPerStaff: '$115.29' },
            { department: 'Sales & Marketing', registeredStaff: 50, monthlyTrips: 1350, monthlyCost: '$6,200', usageShare: '16.1%', avgCostPerStaff: '$124.00' },
            { department: 'Product & Design', registeredStaff: 45, monthlyTrips: 1215, monthlyCost: '$5,100', usageShare: '13.3%', avgCostPerStaff: '$113.33' },
            { department: 'Finance & HR', registeredStaff: 42, monthlyTrips: 756, monthlyCost: '$3,150', usageShare: '8.2%', avgCostPerStaff: '$75.00' },
          ],
          executiveNotes: [
            'Engineering staff exhibit the highest average weekly shuttle usage rate (4.8 trips/week).',
            'All departments remained within their allotted monthly transport subsidies.',
          ],
        };

      case 'COMPLAINT_SUPPORT':
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Commuter Helpdesk Ticket Resolution & SLA Metrics',
          generatedAt: timestamp,
          generatedBy: 'Helpdesk Admin (Sarah Jenkins)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: 'Total Tickets Received', value: '48 Tickets', change: '-18% vs last month', trend: 'down' },
            { label: 'Resolved Tickets', value: '44 Resolved', change: '91.6% Resolution Rate' },
            { label: 'Pending / Open', value: '4 Tickets', description: 'Under active review' },
            { label: 'Avg Resolution SLA', value: '2.4 Hours', change: 'Target: < 4.0 Hrs', trend: 'down' },
          ],
          chartTitle: 'Support Complaints by Priority Breakdown',
          chartType: 'pie',
          chartData: [
            { name: 'Low Priority', value: 24 },
            { name: 'Medium Priority', value: 16 },
            { name: 'High Priority', value: 6 },
            { name: 'Critical Priority', value: 2 },
          ],
          tableColumns: [
            { key: 'category', header: 'Ticket Category' },
            { key: 'totalLogged', header: 'Logged' },
            { key: 'resolved', header: 'Resolved' },
            { key: 'openPending', header: 'Pending' },
            { key: 'avgSlaHours', header: 'Avg SLA' },
            { key: 'satisfaction', header: 'Satisfaction' },
          ],
          tableData: [
            { category: 'Seat Reservation Issue', totalLogged: 18, resolved: 17, openPending: 1, avgSlaHours: '1.2 hrs', satisfaction: '98%' },
            { category: 'Shuttle Delay / ETA Notice', totalLogged: 14, resolved: 13, openPending: 1, avgSlaHours: '2.0 hrs', satisfaction: '94%' },
            { category: 'AC / Vehicle Cleanliness', totalLogged: 8, resolved: 8, openPending: 0, avgSlaHours: '3.5 hrs', satisfaction: '96%' },
            { category: 'Driver Conduct Feedback', totalLogged: 5, resolved: 4, openPending: 1, avgSlaHours: '4.1 hrs', satisfaction: '92%' },
            { category: 'Route / Stop Addition Request', totalLogged: 3, resolved: 2, openPending: 1, avgSlaHours: '6.0 hrs', satisfaction: '90%' },
          ],
          executiveNotes: [
            'Ticket resolution time improved by 40% following automated seat re-allocation tooling.',
            'Zero critical safety or harassment issues were reported during this period.',
          ],
        };

      case 'OPERATIONAL_SUMMARY':
      default:
        return {
          reportType: type,
          title: meta.title,
          subtitle: 'Enterprise Fleet & Commute Operations Executive Summary',
          generatedAt: timestamp,
          generatedBy: 'Admin Console (Sarah Jenkins)',
          appliedFilters: filters,
          summaryMetrics: [
            { label: "Today's Active Trips", value: '48 Trips', change: '100% On-Schedule' },
            { label: 'Active Vehicles & Drivers', value: '18 / 18 Units', change: 'Full Deployment' },
            { label: 'Employees Transported', value: '684 Commuters', change: '+4.2%', trend: 'up' },
            { label: 'System Health Score', value: '99.8%', description: 'All Services Operational' },
          ],
          chartTitle: 'Daily Commuter Volume & Fleet Occupancy Trend',
          chartType: 'area',
          chartData: [
            { name: 'Mon', commuters: 620, occupancy: 86 },
            { name: 'Tue', commuters: 650, occupancy: 88 },
            { name: 'Wed', commuters: 684, occupancy: 91 },
            { name: 'Thu', commuters: 670, occupancy: 89 },
            { name: 'Fri', commuters: 640, occupancy: 85 },
          ],
          tableColumns: [
            { key: 'metric', header: 'Key Operational Area' },
            { key: 'currentValue', header: 'Current Value' },
            { key: 'targetValue', header: 'Target Benchmark' },
            { key: 'variance', header: 'Variance' },
            { key: 'status', header: 'Health Status' },
          ],
          tableData: [
            { metric: 'Daily Trips Executed', currentValue: '48 Trips/day', targetValue: '45 Trips/day', variance: '+6.6%', status: 'EXCELLENT' },
            { metric: 'Fleet On-Time Arrival', currentValue: '96.8%', targetValue: '95.0%', variance: '+1.8%', status: 'EXCELLENT' },
            { metric: 'Seat Occupancy Rate', currentValue: '88.6%', targetValue: '80.0%', variance: '+8.6%', status: 'EXCELLENT' },
            { metric: 'Passenger Satisfaction', currentValue: '4.92 / 5.0', targetValue: '4.50 / 5.0', variance: '+9.3%', status: 'EXCELLENT' },
            { metric: 'Open Support Tickets', currentValue: '4 Tickets', targetValue: '< 10 Tickets', variance: '-60.0%', status: 'OPTIMAL' },
          ],
          executiveNotes: [
            'Off-Go shuttle operations operated with 99.8% uptime and zero safety incidents.',
            'Fleet expansion for Q4 has been submitted for board approval to support 2 new technology centers.',
          ],
        };
    }
  },

  downloadCSV(reportData: ReportDataPayload) {
    const headers = reportData.tableColumns.map((c) => c.header).join(',');
    const rows = reportData.tableData.map((row) =>
      reportData.tableColumns
        .map((c) => {
          const val = row[c.key] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportData.reportType.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download in history
    this.recordDownload(reportData.reportType, 'CSV');
  },

  downloadExcel(reportData: ReportDataPayload) {
    // Generate HTML Table structure compatible with Excel export (.xls)
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${reportData.title.slice(0, 30)}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #334155; padding: 8px; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
          .title { font-size: 18px; font-weight: bold; color: #0f172a; }
          .meta { font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="title">${reportData.title}</div>
        <div class="meta">Generated At: ${reportData.generatedAt} | By: ${reportData.generatedBy}</div>
        <br/>
        <table>
          <thead>
            <tr>
              ${reportData.tableColumns.map((c) => `<th>${c.header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${reportData.tableData
              .map(
                (row) =>
                  `<tr>${reportData.tableColumns
                    .map((c) => `<td>${row[c.key] ?? ''}</td>`)
                    .join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportData.reportType.toLowerCase()}_report.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.recordDownload(reportData.reportType, 'EXCEL');
  },

  printReport(reportData: ReportDataPayload) {
    this.recordDownload(reportData.reportType, 'PDF');
    window.print();
  },

  recordDownload(type: ReportType, format: 'PDF' | 'EXCEL' | 'CSV') {
    const existing = reportHistoryStore.find((r) => r.reportType === type);
    if (existing) {
      existing.downloadedCount += 1;
      existing.lastDownloadedAt = new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
      if (!existing.fileTypes.includes(format)) {
        existing.fileTypes.push(format);
      }
    } else {
      const meta = AVAILABLE_REPORTS_LIST.find((r) => r.id === type);
      reportHistoryStore.unshift({
        id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
        reportType: type,
        title: meta?.title || type,
        generatedBy: 'Sarah Jenkins (Chief Ops)',
        generatedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        downloadedCount: 1,
        lastDownloadedAt: 'Just now',
        fileTypes: [format],
        status: 'READY',
        recordCount: 50,
      });
    }
  },
};
