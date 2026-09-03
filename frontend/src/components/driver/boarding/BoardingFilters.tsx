import React from 'react';
import { Layers, Building2 } from 'lucide-react';

export type StopFilterType = 'ALL_STOPS' | 'CURRENT_STOP' | 'UPCOMING_STOPS' | 'COMPLETED_STOPS';

interface BoardingFiltersProps {
  stopFilter: StopFilterType;
  onStopFilterChange: (filter: StopFilterType) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (dept: string) => void;
  departments: string[];
}

export const BoardingFilters: React.FC<BoardingFiltersProps> = ({
  stopFilter,
  onStopFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  departments,
}) => {
  const stopFilters: { key: StopFilterType; label: string }[] = [
    { key: 'ALL_STOPS', label: 'All Stops' },
    { key: 'CURRENT_STOP', label: 'Current Stop' },
    { key: 'UPCOMING_STOPS', label: 'Upcoming Stops' },
    { key: 'COMPLETED_STOPS', label: 'Completed Stops' },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
      {/* Stop Filter */}
      <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1.5 mr-1">
          <Layers className="w-3.5 h-3.5 text-indigo-500" /> Filter Stop:
        </span>
        {stopFilters.map((sf) => (
          <button
            key={sf.key}
            onClick={() => onStopFilterChange(sf.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
              stopFilter === sf.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* Department Filter */}
      <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Department:
        </span>
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentFilterChange(e.target.value)}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
        >
          <option value="ALL_DEPTS">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
