import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bus, MapPin, Users, Activity, Edit3, ShieldCheck } from 'lucide-react';
import { ShuttleDetailItem } from '../../types';
import { VehicleProfileCard } from './VehicleProfileCard';
import { AssignmentCard } from './AssignmentCard';
import { MaintenanceCard } from './MaintenanceCard';

interface ShuttleDetailsDrawerProps {
  shuttle: ShuttleDetailItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (shuttle: ShuttleDetailItem) => void;
}

export const ShuttleDetailsDrawer: React.FC<ShuttleDetailsDrawerProps> = ({
  shuttle,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!shuttle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {shuttle.vehicleNumber}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Shuttle Asset Details & Telemetry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(shuttle);
                  }}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Vehicle Profile Section */}
              <VehicleProfileCard shuttle={shuttle} />

              {/* Assignment Card */}
              <AssignmentCard shuttle={shuttle} />

              {/* Live Location / Occupancy Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Live Location & Occupancy
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current Occupancy</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {shuttle.occupancy} / {shuttle.capacity} Passengers
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Telemetry Status</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ● Live Signal Active
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Location: {shuttle.currentLocation?.address || 'Depot Terminal Yard'}
                  </span>
                </div>
              </div>

              {/* Maintenance Status */}
              <MaintenanceCard shuttle={shuttle} />

              {/* Recent Activity Logs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" /> Recent Vehicle Activity
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Pre-trip Vehicle Safety Diagnostic Completed
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Updated {shuttle.lastUpdated}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Registration & Safety Compliance Verified
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Registration Exp: 2027-12-31
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
