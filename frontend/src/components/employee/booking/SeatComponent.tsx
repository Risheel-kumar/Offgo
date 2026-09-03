import React from 'react';
import { motion } from 'framer-motion';
import { SeatItem } from '../../../types';
import { Check, Lock, UserCheck, Shield, Sparkles } from 'lucide-react';

interface SeatComponentProps {
  seat: SeatItem;
  isSelected: boolean;
  onSelect: (seat: SeatItem) => void;
  onHover?: (seat: SeatItem | null) => void;
}

export const SeatComponent: React.FC<SeatComponentProps> = ({
  seat,
  isSelected,
  onSelect,
  onHover,
}) => {
  const isReserved = seat.status === 'RESERVED';
  const isBlocked = seat.status === 'BLOCKED' || seat.status === 'UNAVAILABLE';
  const isPriority = seat.status === 'PRIORITY' || seat.isPriority;

  // Determine styling based on seat state
  const getSeatClasses = () => {
    if (isSelected) {
      return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/40 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105';
    }
    if (isReserved) {
      return 'bg-rose-950/40 border-rose-800/60 text-rose-400/60 cursor-not-allowed opacity-80';
    }
    if (isBlocked) {
      return 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50Pattern';
    }
    if (isPriority) {
      return 'bg-amber-950/30 border-amber-500/50 text-amber-300 hover:border-amber-400 hover:bg-amber-900/40 cursor-pointer shadow-sm shadow-amber-500/10';
    }
    // Available
    return 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-indigo-400 hover:bg-indigo-950/40 hover:text-white cursor-pointer shadow-md shadow-slate-950/50';
  };

  return (
    <div className="relative group">
      <motion.button
        type="button"
        whileHover={!isReserved && !isBlocked ? { scale: 1.08, y: -2 } : {}}
        whileTap={!isReserved && !isBlocked ? { scale: 0.95 } : {}}
        onClick={() => onSelect(seat)}
        onMouseEnter={() => onHover && onHover(seat)}
        onMouseLeave={() => onHover && onHover(null)}
        disabled={isReserved || isBlocked}
        className={`relative w-11 h-12 sm:w-12 sm:h-13 rounded-t-xl rounded-b-md border-2 transition-all duration-200 flex flex-col items-center justify-between p-1 select-none focus:outline-none ${getSeatClasses()}`}
        aria-label={`Seat ${seat.seatNumber}, ${seat.category} seat, ${seat.status}`}
      >
        {/* Headrest top accent */}
        <div
          className={`w-3/4 h-1.5 rounded-full transition-colors ${
            isSelected
              ? 'bg-blue-200/60'
              : isReserved
              ? 'bg-rose-800/40'
              : isPriority
              ? 'bg-amber-400/40'
              : 'bg-slate-700/60 group-hover:bg-indigo-400/60'
          }`}
        />

        {/* Seat Number or Icon */}
        <div className="flex-1 flex items-center justify-center font-mono font-bold text-xs tracking-tight">
          {isSelected ? (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white text-blue-600 rounded-full p-0.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          ) : isReserved ? (
            <UserCheck className="w-3.5 h-3.5 text-rose-400/70" />
          ) : isBlocked ? (
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          ) : (
            <span>{seat.seatNumber}</span>
          )}
        </div>

        {/* Seat Armrest Base */}
        <div className="w-full flex justify-between px-0.5">
          <div
            className={`w-1 h-3 rounded-l-sm ${
              isSelected
                ? 'bg-blue-300'
                : isReserved
                ? 'bg-rose-900/60'
                : 'bg-slate-700/70 group-hover:bg-indigo-500/50'
            }`}
          />
          <div
            className={`w-1 h-3 rounded-r-sm ${
              isSelected
                ? 'bg-blue-300'
                : isReserved
                ? 'bg-rose-900/60'
                : 'bg-slate-700/70 group-hover:bg-indigo-500/50'
            }`}
          />
        </div>

        {/* Feature badge dot for Window or Priority */}
        {seat.category === 'WINDOW' && !isSelected && !isReserved && !isBlocked && (
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400/80 shadow-sm" />
        )}
        {isPriority && !isSelected && !isReserved && (
          <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};
