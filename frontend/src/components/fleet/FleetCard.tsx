import React from 'react';
import { LiveTrackingVehicle } from '../../types';
import { ScheduleItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  User,
  Navigation,
  Gauge,
  MapPin,
  Clock,
  ChevronDown,
  Users,
  Calendar,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { FleetStatusBadge } from './FleetStatusBadge';
import { FleetTrackingPanel } from './FleetTrackingPanel';
import { FleetStatusPanel } from './FleetStatusPanel';

interface FleetCardProps {
  vehicle: LiveTrackingVehicle;
  allVehicles?: LiveTrackingVehicle[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDriver?: () => void;
  onViewPassengers?: () => void;
  onRefresh?: () => void;
  onStatusChange?: (status: 'INACTIVE' | 'MAINTENANCE') => void;
  isStatusUpdating?: boolean;
  assignedSchedules?: ScheduleItem[];
}

export const FleetCard: React.FC<FleetCardProps> = ({
  vehicle,
  allVehicles = [],
  isExpanded,
  onToggleExpand,
  onViewDriver,
  onViewPassengers,
  onRefresh,
  onStatusChange,
  isStatusUpdating = false,
  assignedSchedules = [],
}) => {
  const normStatus = (vehicle.status || '').toUpperCase().replace(/ /g, '_');
  const isRunning =
    normStatus === 'ACTIVE' ||
    normStatus === 'RUNNING' ||
    normStatus === 'IN_TRANSIT' ||
    normStatus === 'ON_TIME' ||
    normStatus === 'DELAYED';

  const occupancyCount = vehicle.occupancyCount ?? vehicle.occupancy ?? 0;
  const maxCapacity = vehicle.maxCapacity ?? vehicle.capacity ?? 0;
  const shiftText = vehicle.departureTime && vehicle.arrivalTime
    ? `${vehicle.departureTime} - ${vehicle.arrivalTime}`
    : 'No schedule assigned';
  const lastUpdatedTime = vehicle.lastUpdated || '2s ago';

  return (
    <motion.div
      layout
      transition={{ type: 'spring', damping: 25, stiffness: 280 }}
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        isExpanded
          ? 'bg-slate-900/95 border-indigo-500 shadow-2xl ring-1 ring-indigo-500/30'
          : 'bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/40 shadow-xs'
      }`}
    >
      {/* Clickable Accordion Header Row */}
      <div
        onClick={onToggleExpand}
        className="p-5 cursor-pointer select-none space-y-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Vehicle Info Header */}
          <div className="flex items-start gap-3.5">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <Bus className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                  {vehicle.vehicleNumber}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {vehicle.model || 'Sprinter 2500'}
                </span>
                <FleetStatusBadge status={vehicle.status} size="sm" />
              </div>

              <div className="border-t border-slate-200/70 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Assigned schedules ({assignedSchedules.length})
                </div>
                {assignedSchedules.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No schedule assigned to this shuttle.</p>
                ) : (
                  <div className="mt-2 grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {assignedSchedules.map((schedule) => (
                      <div key={schedule.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-2.5 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{schedule.code || schedule.id}</span>
                          <span className="font-semibold text-slate-500">{schedule.status}</span>
                        </div>
                        <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{schedule.routeName}</p>
                        <p className="mt-1 text-slate-500">
                          {schedule.startDate || 'Date unavailable'} · Source {schedule.departureTime || 'Time unavailable'} · Destination {schedule.arrivalTime || 'Time unavailable'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                {vehicle.routeName || 'Unassigned route'}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Driver: {vehicle.driverName || 'Unassigned'}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {shiftText}
                </span>
                <span className="flex items-center gap-1 font-medium font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Updated: {lastUpdatedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Metric Badges & Accordion Trigger */}
          <div className="flex items-center gap-3 justify-between lg:justify-end">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Speed</span>
                <span className="font-mono font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" /> {vehicle.speedKmH} km/h
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Occupancy</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {occupancyCount} / {maxCapacity}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Next Stop</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate block max-w-[110px]">
                  {vehicle.nextStop || 'No live stop'}
                </span>
              </div>
            </div>

            {/* Framer Motion Rotating Chevron Button */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Accordion Smooth Expandable Content using Framer Motion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="border-t border-slate-200 dark:border-slate-800"
          >
            <div className="p-5 space-y-4 bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4" onClick={(event) => event.stopPropagation()}>
                <span className="text-xs font-semibold text-slate-400">Shuttle status</span>
                {(['INACTIVE', 'MAINTENANCE'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isStatusUpdating || normStatus === status}
                    onClick={() => onStatusChange?.(status)}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-colors ${normStatus === status ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {isRunning ? (
                <FleetTrackingPanel
                  vehicle={vehicle}
                  allVehicles={allVehicles}
                  onRefresh={onRefresh}
                />
              ) : (
                <FleetStatusPanel
                  vehicle={vehicle}
                  onOpenDriverDetails={onViewDriver}
                  onOpenPassengers={onViewPassengers}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
