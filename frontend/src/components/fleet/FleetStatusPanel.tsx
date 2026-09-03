import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  PauseCircle,
  UserX,
  CheckCircle2,
  XCircle,
  Calendar,
  UserPlus,
  Bus,
  History,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { LiveTrackingVehicle } from '../../types';
import { FleetStatusBadge } from './FleetStatusBadge';
import { Button } from '../common/buttons/Button';
import toast from 'react-hot-toast';

interface FleetStatusPanelProps {
  vehicle: LiveTrackingVehicle;
  onOpenDriverDetails?: () => void;
  onOpenPassengers?: () => void;
}

export const FleetStatusPanel: React.FC<FleetStatusPanelProps> = ({
  vehicle,
  onOpenDriverDetails,
  onOpenPassengers,
}) => {
  const normStatus = (vehicle.status || '').toUpperCase().replace(/ /g, '_');

  let Icon = PauseCircle;
  let iconBg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let title = 'Shuttle Inactive';
  let explanation =
    'This shuttle is currently inactive and has not been assigned to today\'s operations.';
  let expectedAvailability = 'Pending dispatch assignment';

  switch (normStatus) {
    case 'MAINTENANCE':
      Icon = Wrench;
      iconBg = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      title = 'Shuttle In Maintenance';
      explanation =
        'This shuttle is undergoing scheduled maintenance and is temporarily unavailable for passenger transit.';
      expectedAvailability = 'Expected return: Tomorrow, 08:00 AM';
      break;

    case 'DRIVER_ON_LEAVE':
      Icon = UserX;
      iconBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      title = 'Assigned Driver Unavailable';
      explanation =
        'The assigned driver is currently unavailable or on leave. Operations will resume once a substitute driver is reassigned.';
      expectedAvailability = 'Awaiting admin driver reassignment';
      break;

    case 'SCHEDULED':
      Icon = Clock;
      iconBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      title = 'Shift Scheduled';
      explanation =
        'This shuttle is scheduled for an upcoming route shift but has not yet started today\'s trip execution.';
      expectedAvailability = 'Scheduled Departure: Today, 05:30 PM';
      break;

    case 'COMPLETED':
      Icon = CheckCircle2;
      iconBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      title = 'Daily Shifts Completed';
      explanation =
        'This shuttle has successfully completed all assigned route trips for today\'s shift schedule.';
      expectedAvailability = 'Next Shift: Tomorrow, 07:30 AM';
      break;

    case 'CANCELLED':
      Icon = XCircle;
      iconBg = 'bg-red-500/10 text-red-400 border-red-500/20';
      title = 'Route Shift Cancelled';
      explanation =
        'This scheduled shuttle trip has been cancelled by the fleet administrator.';
      expectedAvailability = 'No further trips today';
      break;

    case 'IDLE':
    case 'INACTIVE':
    default:
      Icon = PauseCircle;
      iconBg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      title = 'Shuttle Inactive';
      explanation =
        'This shuttle is currently inactive and has not been assigned to today\'s operations.';
      expectedAvailability = 'Depot Standby';
      break;
  }

  const handleActionClick = (actionName: string) => {
    toast.success(`Action initiated: ${actionName} for ${vehicle.vehicleNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-6"
    >
      {/* Centered Status Hero Illustration */}
      <div className="flex flex-col items-center text-center space-y-3 py-4 max-w-lg mx-auto">
        <div className={`p-5 rounded-3xl border shadow-lg ${iconBg}`}>
          <Icon className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <FleetStatusBadge status={vehicle.status} size="sm" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">{explanation}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{expectedAvailability}</span>
        </div>
      </div>

      {/* Shuttle Operational Metadata Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Assigned Route</span>
          <span className="font-bold text-slate-200 truncate block">{vehicle.routeName}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Primary Driver</span>
          <span className="font-bold text-slate-200 truncate block">{vehicle.driverName}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Seating Capacity</span>
          <span className="font-bold text-slate-200">{vehicle.maxCapacity || 24} Seats</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Vehicle Number</span>
          <span className="font-mono font-bold text-indigo-400">{vehicle.vehicleNumber}</span>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Admin Quick Actions
        </h4>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleActionClick('Assign Substitute Driver')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Assign Driver</span>
          </button>

          <button
            onClick={() => handleActionClick('Reassign Shuttle Route')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Bus className="w-4 h-4 text-indigo-400" />
            <span>Reassign Shuttle</span>
          </button>

          <button
            onClick={() => handleActionClick('View Shift Schedule')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>View Schedule</span>
          </button>

          <button
            onClick={() => handleActionClick('Open Maintenance Ticket')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-rose-400" />
            <span>Maintenance Logs</span>
          </button>

          <button
            onClick={() => handleActionClick('View Trip History')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>Trip History</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
