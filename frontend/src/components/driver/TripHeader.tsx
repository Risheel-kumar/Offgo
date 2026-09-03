import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/buttons/Button';
import { Compass, Play, Pause, Square, Building2, Shield, Radio, RotateCcw } from 'lucide-react';
import { DriverTripNavigationState } from '../../services/driverNavigationService';

interface TripHeaderProps {
  trip: DriverTripNavigationState | null;
  onStartShiftClick: () => void;
  onPauseClick: () => void;
  onResumeClick: () => void;
  onEndTripClick: () => void;
  onResetClick: () => void;
  isProcessing?: boolean;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
  trip,
  onStartShiftClick,
  onPauseClick,
  onResumeClick,
  onEndTripClick,
  onResetClick,
  isProcessing,
}) => {
  const status = trip?.status || 'SCHEDULED';

  const getStatusBadge = () => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Radio className="w-3.5 h-3.5" /> SHIFT RUNNING
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Pause className="w-3.5 h-3.5" /> SHIFT PAUSED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Shield className="w-3.5 h-3.5" /> TRIP COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Compass className="w-3.5 h-3.5 text-indigo-500" /> SHIFT SCHEDULED
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            {getStatusBadge()}
            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
              {trip?.tripCode || 'ORR-EXP-0830'}
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-500" /> Office Destination
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {trip?.routeName || 'Outer Ring Road Corporate Express'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span>Vehicle: <strong className="text-slate-900 dark:text-slate-200 font-mono">{trip?.vehicleNumber || 'KA-01-MJ-8902'}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Driver: <strong className="text-slate-900 dark:text-slate-200">{trip?.driverName || 'Rajesh Kumar'}</strong></span>
            {trip?.startTime && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>Shift Started: <strong className="text-emerald-600 dark:text-emerald-400">{trip.startTime}</strong></span>
              </>
            )}
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          {status === 'SCHEDULED' && (
            <Button
              variant="primary"
              size="lg"
              disabled={isProcessing}
              onClick={onStartShiftClick}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Shift & Navigation
            </Button>
          )}

          {status === 'RUNNING' && (
            <>
              <Button
                variant="outline"
                size="md"
                disabled={isProcessing}
                onClick={onPauseClick}
                leftIcon={<Pause className="w-4 h-4" />}
                className="hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                Pause Shift
              </Button>
              <Button
                variant="danger"
                size="md"
                disabled={isProcessing}
                onClick={onEndTripClick}
                leftIcon={<Square className="w-4 h-4" />}
                className="hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                End Trip
              </Button>
            </>
          )}

          {status === 'PAUSED' && (
            <>
              <Button
                variant="primary"
                size="md"
                disabled={isProcessing}
                onClick={onResumeClick}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                className="shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all"
              >
                Resume Navigation
              </Button>
              <Button
                variant="danger"
                size="md"
                disabled={isProcessing}
                onClick={onEndTripClick}
                leftIcon={<Square className="w-4 h-4" />}
              >
                End Trip
              </Button>
            </>
          )}

          {status === 'COMPLETED' && (
            <Button
              variant="outline"
              size="md"
              disabled={isProcessing}
              onClick={onResetClick}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Shift State
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

