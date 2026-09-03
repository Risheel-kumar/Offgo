import React from 'react';
import { Table, Column } from '../common/tables/Table';
import { TransportExpenseReportItem } from '../../types';
import { Button } from '../common/buttons/Button';
import { Eye, DollarSign, CheckCircle2, Clock } from 'lucide-react';

interface ExpenseTableProps {
  reports: TransportExpenseReportItem[];
  isLoading?: boolean;
  onSelectEmployee: (report: TransportExpenseReportItem) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  reports,
  isLoading,
  onSelectEmployee,
}) => {
  const columns: Column<TransportExpenseReportItem>[] = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (r) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {r.employeeId}
        </span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (r) => (
        <div>
          <p className="font-extrabold text-xs text-slate-900 dark:text-white">{r.employeeName}</p>
          <p className="text-[11px] text-slate-500">{r.month}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {r.department}
        </span>
      ),
    },
    {
      key: 'totalTrips',
      header: 'Trips Completed',
      render: (r) => (
        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
          {r.totalTrips} Rides
        </span>
      ),
    },
    {
      key: 'distanceTravelledKm',
      header: 'Distance Travelled',
      render: (r) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {r.distanceTravelledKm || r.totalTrips * 14} km
        </span>
      ),
    },
    {
      key: 'subsidizedCostINR',
      header: 'Monthly Expense',
      render: (r) => (
        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
          ₹{r.subsidizedCostINR.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'avgCostPerTripInr',
      header: 'Avg Cost / Trip',
      render: (r) => {
        const avg = r.avgCostPerTripInr || (r.totalTrips ? (r.subsidizedCostINR / r.totalTrips).toFixed(2) : 0);
        return <span className="font-mono text-xs text-slate-500">₹{avg}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            r.status === 'APPROVED'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}
        >
          {r.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {r.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelectEmployee(r)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <Table
        data={reports}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No employee transport expenses found for selected filters."
      />
    </div>
  );
};
