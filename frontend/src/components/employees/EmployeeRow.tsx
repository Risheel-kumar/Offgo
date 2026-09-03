import React from 'react';
import { Employee } from '../../types';
import { StatusChip } from '../common/tables/StatusChip';
import { Eye, Trash2, Bus, Ticket, Building2, Phone, Mail } from 'lucide-react';

interface EmployeeRowProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  onViewDetails,
  onDelete,
}) => {
  return (
    <tr
      onClick={() => onViewDetails(employee)}
      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60"
    >
      {/* Employee ID */}
      <td className="px-4 py-3.5 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
        {employee.employeeId}
      </td>

      {/* Name & Avatar */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img
            src={
              employee.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                employee.name
              )}&background=6366f1&color=fff`
            }
            alt={employee.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {employee.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Mail className="w-3 h-3 shrink-0" />
              <span>{employee.email}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-slate-400" />
          <span>{employee.phone}</span>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3.5 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">{employee.department}</span>
        </div>
      </td>

      {/* Assigned Shuttle */}
      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
        {employee.assignedShuttle ? (
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
            <Bus className="w-3.5 h-3.5 shrink-0" />
            <span>{employee.assignedShuttle.vehicleNumber}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({employee.assignedShuttle.routeName})
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
        )}
      </td>

      {/* Current Booking */}
      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
        {employee.currentBooking ? (
          <div className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {employee.currentBooking.pickupStop}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              {employee.currentBooking.status}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">No Active Booking</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <StatusChip status={employee.status} type="user" />
      </td>

      {/* Created Date */}
      <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {employee.createdAt}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onViewDetails(employee)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            title="Delete Employee"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
