import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTrackingVehicle } from '../../types';
import { Button } from '../common/buttons/Button';
import {
  X,
  Bus,
  User,
  Phone,
  Users,
  Route,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FleetDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: LiveTrackingVehicle | null;
  initialTab?: 'TELEMATICS' | 'DRIVER' | 'PASSENGERS' | 'HISTORY';
}

export const FleetDetailsDrawer: React.FC<FleetDetailsDrawerProps> = ({
  isOpen,
  onClose,
  vehicle,
  initialTab = 'TELEMATICS',
}) => {
  const [activeTab, setActiveTab] = useState<'TELEMATICS' | 'DRIVER' | 'PASSENGERS' | 'HISTORY'>(initialTab);

  if (!isOpen || !vehicle) return null;

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
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                  {vehicle.vehicleNumber}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {vehicle.model} &bull; {vehicle.routeName}
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

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-100/50 dark:bg-slate-950/50 text-xs font-bold">
            <button
              onClick={() => setActiveTab('TELEMATICS')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'TELEMATICS'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Telematics
            </button>
            <button
              onClick={() => setActiveTab('DRIVER')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'DRIVER'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Driver Info
            </button>
            <button
              onClick={() => setActiveTab('PASSENGERS')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'PASSENGERS'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Passengers ({vehicle.occupancyCount})
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Trip History
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTab === 'TELEMATICS' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Current GPS Telematics</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Speed</span>
                      <span className="font-mono font-bold">{vehicle.speedKmH} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Next Stop</span>
                      <span className="font-bold">{vehicle.nextStop}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ETA</span>
                      <span className="font-mono font-bold text-indigo-400">{vehicle.nextStopEtaMinutes} mins</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'DRIVER' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 font-black text-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">{vehicle.driverName}</h4>
                    <p className="text-xs text-slate-400 font-mono">Driver ID: {vehicle.driverId}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Contact Phone:</span>
                  <span className="font-mono font-bold text-indigo-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {vehicle.driverPhone}
                  </span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success(`Initiating call to ${vehicle.driverName} (${vehicle.driverPhone})...`)}
                >
                  Call Driver Directly
                </Button>
              </div>
            )}

            {activeTab === 'PASSENGERS' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Assigned Commuters ({vehicle.assignedPassengers?.length || 0})</span>
                  <span className="text-emerald-500 font-mono">
                    {vehicle.occupancyCount} / {vehicle.maxCapacity} Occupied
                  </span>
                </div>

                <div className="space-y-2">
                  {vehicle.assignedPassengers?.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">Seat {p.seatNumber} &bull; {p.boardingStop}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.checkedIn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {p.checkedIn ? 'Checked In' : 'Reserved'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'HISTORY' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">Recent Trip Dispatches</h4>
                <p className="text-sm text-slate-500">Trip history is not available from the live fleet API yet.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
