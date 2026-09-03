import React from 'react';
import { Employee } from '../../types';
import { StatusChip } from '../common/tables/StatusChip';
import { Eye, Trash2, Bus, Ticket, Building2, Phone, Mail } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onViewDetails,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onViewDetails(employee)}
      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={
              employee.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                employee.name
              )}&background=6366f1&color=fff`
            }
            alt={employee.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {employee.name}
            </div>
            <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              {employee.employeeId}
            </div>
          </div>
        </div>

        <StatusChip status={employee.status} type="user" />
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Mail className="w-3.5 h-3.5" /> Email
          </span>
          <span className="font-medium truncate max-w-[180px]">{employee.email}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Phone className="w-3.5 h-3.5" /> Phone
          </span>
          <span className="font-medium">{employee.phone}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Building2 className="w-3.5 h-3.5" /> Department
          </span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{employee.department}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Bus className="w-3.5 h-3.5" /> Assigned Shuttle
          </span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {employee.assignedShuttle ? employee.assignedShuttle.vehicleNumber : 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Ticket className="w-3.5 h-3.5 text-emerald-500" /> Booking
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {employee.currentBooking ? employee.currentBooking.pickupStop : 'No Booking'}
          </span>
        </div>
      </div>

      <div
        className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onViewDetails(employee)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View Profile
        </button>
        <button
          onClick={() => onDelete(employee)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};
