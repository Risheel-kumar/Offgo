import React from 'react';
import { Filter, Calendar, Building, Users, Bus, MapPin, CheckCircle, RotateCcw } from 'lucide-react';
import { ReportFilterOptions } from '../../../types/reports';

interface ReportFiltersProps {
  filters: ReportFilterOptions;
  onChange: (filters: ReportFilterOptions) => void;
  onApply: () => void;
  onReset: () => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
}) => {
  const handleChange = (key: keyof ReportFilterOptions, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateChange = (key: 'start' | 'end', value: string) => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Report Parameters & Filter Controls
          </h4>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Date Range Start & End */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Start Date
            </span>
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              End Date
            </span>
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Month</label>
          <select
            value={filters.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Year</label>
          <select
            value={filters.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Department
            </span>
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Finance & HR">Finance & HR</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
          </select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Bus className="w-3.5 h-3.5 text-slate-400" />
              Vehicle
            </span>
          </label>
          <select
            value={filters.vehicleId}
            onChange={(e) => handleChange('vehicleId', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Vehicles</option>
            <option value="OFF-GO-101">OFF-GO-101 (Sprinter)</option>
            <option value="OFF-GO-104">OFF-GO-104 (BYD EV)</option>
            <option value="OFF-GO-108">OFF-GO-108 (Volvo Coach)</option>
            <option value="OFF-GO-112">OFF-GO-112 (Tata Starbus)</option>
            <option value="OFF-GO-115">OFF-GO-115 (Isuzu Executive)</option>
          </select>
        </div>

        {/* Route */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Route
            </span>
          </label>
          <select
            value={filters.routeId}
            onChange={(e) => handleChange('routeId', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Routes</option>
            <option value="R-1">Outer Ring Road Express</option>
            <option value="R-2">Whitefield Tech Corridor</option>
            <option value="R-3">Electronic City Direct</option>
            <option value="R-4">North Bangalore Line</option>
            <option value="R-5">Airport Corridor Shuttle</option>
          </select>
        </div>

        {/* Trip Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
              Trip Status
            </span>
          </label>
          <select
            value={filters.tripStatus}
            onChange={(e) => handleChange('tripStatus', e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="SCHEDULED">Scheduled / In-Progress</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No-Show</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onApply}
          className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
        >
          Apply Filters & Re-Generate
        </button>
      </div>
    </div>
  );
};
