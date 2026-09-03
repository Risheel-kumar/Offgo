import React from 'react';
import { Search, Filter, Download, RefreshCw, Plus, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { BookingFilterOptions } from '../../types';

interface BookingToolbarProps {
  filters: BookingFilterOptions;
  onFilterChange: (updated: Partial<BookingFilterOptions>) => void;
  viewMode: 'table' | 'calendar';
  onViewModeChange: (mode: 'table' | 'calendar') => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  onCreateBooking: () => void;
  isRefreshing?: boolean;
}

export const BookingToolbar: React.FC<BookingToolbarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  onExportCSV,
  onCreateBooking,
  isRefreshing,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by Booking ID, Employee, Shuttle, Route..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Table / Calendar View Toggle */}
          <div className="bg-slate-950 p-1 border border-slate-800 rounded-xl flex items-center">
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={() => onViewModeChange('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-medium transition-colors"
            title="Refresh Bookings Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-medium transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateBooking}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Booking</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>

        {/* Status Filter */}
        <select
          value={filters.bookingStatusFilter || 'ALL'}
          onChange={(e) => onFilterChange({ bookingStatusFilter: e.target.value })}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>

        {/* Travel Date Filter */}
        <select
          value={filters.travelDateFilter || 'ALL'}
          onChange={(e) => onFilterChange({ travelDateFilter: e.target.value })}
          className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Travel Dates</option>
          <option value="2026-07-22">Today (2026-07-22)</option>
          <option value="2026-07-23">Tomorrow (2026-07-23)</option>
          <option value="2026-07-21 font-mono">Yesterday (2026-07-21)</option>
        </select>
      </div>
    </div>
  );
};
