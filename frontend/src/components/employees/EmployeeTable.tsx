import React, { useState, useMemo } from 'react';
import { Employee } from '../../types';
import { EmployeeRow } from './EmployeeRow';
import { EmployeeCard } from './EmployeeCard';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

type SortField = 'employeeId' | 'name' | 'department' | 'status' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onViewDetails,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      let valA: string = a[sortField] || '';
      let valB: string = b[sortField] || '';

      if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
      }

      const cmp = valA.localeCompare(valB, undefined, { numeric: true });
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [employees, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <SlidersHorizontal className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Desktop Enterprise Table Layout */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th
                  onClick={() => handleSort('employeeId')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>EMP ID</span>
                    {renderSortIcon('employeeId')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Employee Name</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th className="px-4 py-3">Phone</th>
                <th
                  onClick={() => handleSort('department')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Department</span>
                    {renderSortIcon('department')}
                  </div>
                </th>
                <th className="px-4 py-3">Assigned Shuttle</th>
                <th className="px-4 py-3">Current Booking</th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('createdAt')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Joined Date</span>
                    {renderSortIcon('createdAt')}
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {paginatedEmployees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onViewDetails={onViewDetails}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {paginatedEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-3 shadow-2xs text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {employees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {Math.min(currentPage * pageSize, employees.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {employees.length}
          </span>{' '}
          employee records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
