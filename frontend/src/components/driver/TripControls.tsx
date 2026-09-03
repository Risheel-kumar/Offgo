import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/buttons/Button';
import {
  Play,
  Pause,
  Square,
  Navigation,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { DriverTripNavigationState, DriverNavigationStop } from '../../services/driverNavigationService';

interface TripControlsProps {
  trip: DriverTripNavigationState | null;
  currentStop: DriverNavigationStop | null;
  onStartShiftClick: () => void;
  onMarkCompleted: (stopId: string) => void;
  onPauseClick: () => void;
  onResumeClick: () => void;
  onEndTripClick: () => void;
  onResetClick: () => void;
  isProcessing?: boolean;
  isWithinArrivalRadius?: boolean;
}

export const TripControls: React.FC<TripControlsProps> = ({
  trip,
  currentStop,
  onStartShiftClick,
  onMarkCompleted,
  onPauseClick,
  onResumeClick,
  onEndTripClick,
  onResetClick,
  isProcessing,
  isWithinArrivalRadius = false,
}) => {
  const status = trip?.status || 'SCHEDULED';

  const handleOpenGoogleMapsDirections = () => {
    if (!trip) return;
    const destination = encodeURIComponent(
      `${trip.officeDestination.lat},${trip.officeDestination.lng}`
    );
    const origin = encodeURIComponent(
      `${trip.currentLocation.lat},${trip.currentLocation.lng}`
    );
    const waypoints = trip.stops
      .filter((s) => s.status !== 'COMPLETED')
      .map((s) => `${s.lat},${s.lng}`)
      .join('|');

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(
      waypoints
    )}&travelmode=driving`;

    window.open(googleMapsUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        {status === 'SCHEDULED' && (
          <Button
            variant="primary"
            size="md"
            disabled={isProcessing || !isWithinArrivalRadius}
            onClick={onStartShiftClick}
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            className="shadow-md shadow-indigo-500/20 hover:scale-[1.02] transition-all"
          >
            Start Shift
          </Button>
        )}

        {status === 'RUNNING' && currentStop && (
          <Button
            variant="primary"
            size="md"
            disabled={isProcessing}
            onClick={() => onMarkCompleted(currentStop.id)}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-all"
          >
            {isWithinArrivalRadius ? 'Arrived - Continue' : 'Within 100 m to continue'}
          </Button>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={handleOpenGoogleMapsDirections}
          leftIcon={<Navigation className="w-4 h-4 text-indigo-500" />}
          rightIcon={<ExternalLink className="w-3.5 h-3.5 opacity-60" />}
          className="hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
        >
          Google Navigation
        </Button>

        {status === 'RUNNING' && (
          <Button
            variant="ghost"
            size="md"
            disabled={isProcessing}
            onClick={onPauseClick}
            leftIcon={<Pause className="w-4 h-4" />}
            className="hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600"
          >
            Pause Trip
          </Button>
        )}

        {status === 'PAUSED' && (
          <Button
            variant="primary"
            size="md"
            disabled={isProcessing}
            onClick={onResumeClick}
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            className="shadow-md shadow-indigo-500/20"
          >
            Resume Trip
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(status === 'RUNNING' || status === 'PAUSED') && (
          <Button
            variant="danger"
            size="md"
            disabled={isProcessing}
            onClick={onEndTripClick}
            leftIcon={<Square className="w-4 h-4" />}
            className="hover:scale-[1.02] transition-all"
          >
            End Shift
          </Button>
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
    </motion.div>
  );
};

