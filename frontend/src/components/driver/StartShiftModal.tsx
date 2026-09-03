import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/buttons/Button';
import { Compass, Play, Building2, ShieldCheck } from 'lucide-react';

interface StartShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  routeName: string;
  vehicleNumber: string;
  officeName: string;
  stopCount: number;
  totalPassengers: number;
}

export const StartShiftModal: React.FC<StartShiftModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  routeName,
  vehicleNumber,
  officeName,
  stopCount,
  totalPassengers,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start Today's Assigned Route?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Confirm shift start to launch active GPS telematics & navigation to Office HQ.
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Route:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{routeName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Shuttle Vehicle:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{vehicleNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Intermediate Stops:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{stopCount} Boarding Waypoints</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Reserved Passengers:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalPassengers} Confirmed</span>
              </div>
              <div className="flex justify-between items-center py-1 pt-2 text-purple-600 dark:text-purple-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Final Destination:
                </span>
                <span>{officeName}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <span>
                Safety Check: Please ensure seatbelts are operational and vehicle telematics GPS is connected before departure.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                leftIcon={<Play className="w-4 h-4" />}
                className="shadow-md shadow-indigo-500/20"
              >
                Confirm & Start Shift
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

