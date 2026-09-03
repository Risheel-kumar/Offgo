import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';
import { ShuttleRow } from './ShuttleRow';
import { ShuttleCard } from './ShuttleCard';
import { ShuttleSkeleton } from './ShuttleSkeleton';
import { EmptyState } from './EmptyState';

interface ShuttleTableProps {
  shuttles: ShuttleDetailItem[];
  isLoading: boolean;
  onSelectShuttle: (shuttle: ShuttleDetailItem) => void;
  onEditShuttle: (shuttle: ShuttleDetailItem) => void;
  onDeleteShuttle: (id: string) => void;
  onAddShuttle: () => void;
  onResetFilters: () => void;
}

type SortField = 'vehicleNumber' | 'vehicleType' | 'capacity' | 'status' | 'registrationDate';

export const ShuttleTable: React.FC<ShuttleTableProps> = ({
  shuttles,
  isLoading,
  onSelectShuttle,
  onEditShuttle,
  onDeleteShuttle,
  onAddShuttle,
  onResetFilters,
}) => {
  const [sortField, setSortField] = useState<SortField>('vehicleNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShuttles = useMemo(() => {
    return [...shuttles].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [shuttles, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedShuttles.length / pageSize) || 1;
  const paginatedShuttles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedShuttles.slice(start, start + pageSize);
  }, [sortedShuttles, currentPage]);

  if (isLoading) {
    return <ShuttleSkeleton />;
  }

  if (shuttles.length === 0) {
    return <EmptyState onAddShuttle={onAddShuttle} onResetFilters={onResetFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 z-10">
              <tr>
                <th
                  onClick={() => handleSort('vehicleNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Vehicle Number
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('vehicleType')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Vehicle Type
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('capacity')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Capacity
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Current Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('registrationDate')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Reg. Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedShuttles.map((shuttle) => (
                <ShuttleRow
                  key={shuttle.id}
                  shuttle={shuttle}
                  onSelect={onSelectShuttle}
                  onEdit={onEditShuttle}
                  onDelete={onDeleteShuttle}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {paginatedShuttles.map((shuttle) => (
          <ShuttleCard
            key={shuttle.id}
            shuttle={shuttle}
            onSelect={onSelectShuttle}
            onEdit={onEditShuttle}
            onDelete={onDeleteShuttle}
          />
        ))}
      </div>

      {/* Table Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.min((currentPage - 1) * pageSize + 1, shuttles.length)}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.min(currentPage * pageSize, shuttles.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {shuttles.length}
          </span>{' '}
          vehicles
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
