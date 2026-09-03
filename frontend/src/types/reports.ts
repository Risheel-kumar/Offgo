export type ReportType =
  | 'EMPLOYEE_TRANSPORT'
  | 'EMPLOYEE_TRAVEL_HISTORY'
  | 'MONTHLY_EXPENSE'
  | 'FLEET_UTILIZATION'
  | 'DRIVER_PERFORMANCE'
  | 'TRIP_ANALYTICS'
  | 'ROUTE_ANALYTICS'
  | 'DEPARTMENT_USAGE'
  | 'COMPLAINT_SUPPORT'
  | 'OPERATIONAL_SUMMARY';

export interface ReportFilterOptions {
  dateRange: { start: string; end: string };
  month: string;
  year: string;
  department: string;
  employeeId: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  tripStatus: string;
}

export interface ReportMeta {
  id: ReportType;
  title: string;
  category: 'OPERATIONAL' | 'FINANCIAL' | 'HR_TRAVEL' | 'COMPLIANCE';
  description: string;
  iconName: string;
  badge: string;
  badgeColor: string;
  estimatedPages: number;
}

export interface ExecutiveSummaryMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface ReportDataPayload {
  reportType: ReportType;
  title: string;
  subtitle: string;
  generatedAt: string;
  generatedBy: string;
  appliedFilters: ReportFilterOptions;
  summaryMetrics: ExecutiveSummaryMetric[];
  chartTitle?: string;
  chartType: 'bar' | 'pie' | 'line' | 'area';
  chartData: ChartDataPoint[];
  tableColumns: { key: string; header: string }[];
  tableData: Record<string, any>[];
  executiveNotes: string[];
}

export interface ReportHistoryItem {
  id: string;
  reportType: ReportType;
  title: string;
  generatedBy: string;
  generatedAt: string;
  downloadedCount: number;
  lastDownloadedAt?: string;
  fileTypes: ('PDF' | 'EXCEL' | 'CSV')[];
  status: 'READY' | 'GENERATING' | 'FAILED';
  recordCount: number;
}

export interface ReportsStats {
  availableReportsCount: number;
  generatedTodayCount: number;
  lastGeneratedTime: string;
  totalDownloadedCount: number;
}
