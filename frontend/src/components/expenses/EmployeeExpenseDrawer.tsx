import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransportExpenseReportItem } from '../../types';
import { X, User, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface EmployeeExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: TransportExpenseReportItem | null;
}

export const EmployeeExpenseDrawer: React.FC<EmployeeExpenseDrawerProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  const distanceKm = report.distanceTravelledKm || report.totalTrips * 14;
  const avgTripCost = report.avgCostPerTripInr || (report.totalTrips ? (report.subsidizedCostINR / report.totalTrips).toFixed(2) : 0);

  const tripHistory = report.recentTrips || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl text-slate-900 dark:text-white"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {report.employeeName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {report.employeeId} &bull; {report.department}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Expense Overview Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Monthly Transport Expense
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  ₹{report.subsidizedCostINR}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">100% Employer Subsidized</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Completed Dispatches
                </span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                  {report.totalTrips} Rides
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Avg ${avgTripCost} / ride</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Total Distance Travelled
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">
                  {distanceKm} km
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Commute Mileage</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                  Settlement Status
                </span>
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-emerald-500 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> {report.status}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Recorded for Payroll Audit</span>
              </div>
            </div>

            {/* Expense Policy Banner */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                HR Payroll Allowance Note
              </span>
              <p className="text-slate-300 font-medium leading-relaxed">
                This transport expense report is generated automatically at month-end. HR uses this audit record to calculate tax-exempt commuting allowances and payroll deductions.
              </p>
            </div>

            {/* Trip History Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Detailed Monthly Trip History
              </h4>
              <div className="space-y-2">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {trip.routeName}
                      </span>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {trip.pickupStop} &rarr; {trip.dropStop}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">{trip.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-emerald-500 block">
                        ₹{trip.valueINR.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Subsidized</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
