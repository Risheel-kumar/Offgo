import React from 'react';
import { Employee } from '../../types';
import { StatusChip } from '../common/tables/StatusChip';
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Bus,
  Ticket,
  Calendar,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';

interface EmployeeDetailsDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailsDrawer: React.FC<EmployeeDetailsDrawerProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {employee.employeeId}
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Employee Dossier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* User Profile Summary */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <img
              src={
                employee.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employee.name
                )}&background=6366f1&color=fff`
              }
              alt={employee.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20"
            />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {employee.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {employee.department} Division
              </p>
              <div className="pt-1">
                <StatusChip status={employee.status} type="user" />
              </div>
            </div>
          </div>

          {/* Contact & Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              Personal & Contact Details
            </h4>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.email}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.phone}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Building2 className="w-3.5 h-3.5" /> Department
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {employee.department}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {employee.address || 'San Francisco, CA'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> Member Since
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {employee.createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Shuttle */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-indigo-500" />
              Transit & Shuttle Assignment
            </h4>
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl p-4 space-y-2 text-xs">
              {employee.assignedShuttle ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {employee.assignedShuttle.vehicleNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      Assigned Line
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Route: <span className="font-semibold">{employee.assignedShuttle.routeName}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    Pickup Station: {employee.assignedShuttle.pickupStop}
                  </div>
                </>
              ) : (
                <div className="text-center py-3 text-slate-400 italic">
                  No fixed shuttle assigned to this employee.
                </div>
              )}
            </div>
          </div>

          {/* Active Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-emerald-500" />
              Active Shuttle Booking
            </h4>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl p-4 space-y-2 text-xs">
              {employee.currentBooking ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Ref: {employee.currentBooking.bookingRef}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      {employee.currentBooking.status}
                    </span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Scheduled: <span className="font-semibold">{employee.currentBooking.scheduledTime} ({employee.currentBooking.date})</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Pickup: {employee.currentBooking.pickupStop} &rarr; Dropoff: {employee.currentBooking.dropoffStop}
                  </div>
                </>
              ) : (
                <div className="text-center py-3 text-slate-400 italic">
                  No active booking for today's shifts.
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          {employee.attendanceSummary && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-violet-500" />
                Transit Attendance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {employee.attendanceSummary.totalRides}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                    Completed Rides
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {employee.attendanceSummary.attendanceRatePercent}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                    Attendance Rate
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {employee.emergencyContact && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Emergency Contact
              </h4>
              <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3.5 space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {employee.emergencyContact.name} ({employee.emergencyContact.relationship})
                </div>
                <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>{employee.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
