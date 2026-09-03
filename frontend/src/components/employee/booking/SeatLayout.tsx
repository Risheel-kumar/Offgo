import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, User, Navigation, ArrowRight, DoorOpen, Sparkles, ShieldAlert } from 'lucide-react';
import { ShuttleSeatLayout, SeatItem } from '../../../types';
import { SeatComponent } from './SeatComponent';
import { SeatTooltip } from './SeatTooltip';

interface SeatLayoutProps {
  layout: ShuttleSeatLayout;
  selectedSeat: SeatItem | null;
  onSelectSeat: (seat: SeatItem) => void;
}

export const SeatLayout: React.FC<SeatLayoutProps> = ({
  layout,
  selectedSeat,
  onSelectSeat,
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<SeatItem | null>(null);

  // Group seats by row
  const rowsMap: Record<number, SeatItem[]> = {};
  layout.seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  const sortedRowNumbers = Object.keys(rowsMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Subtle Shuttle Frame Outline */}
      <div className="max-w-md mx-auto relative bg-slate-950 border-2 border-slate-800/90 rounded-t-[50px] rounded-b-[24px] p-4 sm:p-6 shadow-inner">
        {/* Front Windshield Curved Front */}
        <div className="absolute top-0 inset-x-8 h-8 border-t-2 border-x-2 border-indigo-500/30 rounded-t-[40px] bg-gradient-to-b from-indigo-500/10 to-transparent flex items-center justify-center">
          <span className="text-[10px] font-mono text-indigo-300 font-bold tracking-widest uppercase flex items-center gap-1">
            <Navigation className="w-3 h-3 text-indigo-400 rotate-45" /> Front Windshield
          </span>
        </div>

        {/* DRIVER CABIN & ENTRANCE DOOR ROW */}
        <div className="pt-8 pb-4 mb-4 border-b border-slate-800 flex items-center justify-between px-2 sm:px-4 bg-slate-900/50 rounded-2xl">
          {/* Driver Cabin (Right side or Left side based on layout) */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              {/* Steering wheel visual */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 15v6M3 12h6M15 12h6" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block leading-none">DRIVER CABIN</span>
              <span className="text-xs font-bold text-slate-200">{layout.driverName}</span>
            </div>
          </div>

          {/* Entrance Door */}
          <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/30 px-3 py-2 rounded-xl text-emerald-400">
            <div className="w-2 h-6 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <span className="text-[10px] text-emerald-300 font-mono block leading-none">ENTRANCE</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                Passenger Door <DoorOpen className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* WINDOW / AISLE LABELS HEADER */}
        <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-slate-400 text-center uppercase tracking-wider mb-3 px-1">
          <div className="col-span-2 flex justify-between px-2">
            <span>Window</span>
            <span>Aisle</span>
          </div>
          <div className="text-blue-400/80 font-bold flex items-center justify-center">
            AISLE
          </div>
          <div className="col-span-2 flex justify-between px-2">
            <span>Aisle</span>
            <span>Window</span>
          </div>
        </div>

        {/* SEAT ROWS CONTAINER */}
        <div className="space-y-3 relative">
          {/* Subtle Aisle Central Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 border-x border-dashed border-slate-800/80 pointer-events-none flex flex-col items-center justify-around">
            <div className="text-[9px] font-mono text-slate-700 font-bold rotate-90 my-2">AISLE</div>
            <div className="text-[9px] font-mono text-slate-700 font-bold rotate-90 my-2">WALKWAY</div>
          </div>

          {sortedRowNumbers.map((rowNum) => {
            const rowSeats = rowsMap[rowNum].sort((a, b) => a.column - b.column);
            const isRearRow = rowNum === sortedRowNumbers[sortedRowNumbers.length - 1];

            return (
              <div key={`row-${rowNum}`} className="relative">
                {/* Row Number Label Indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 mb-1">
                  <span className="text-slate-400 font-bold">R{rowNum.toString().padStart(2, '0')}</span>
                  {rowNum === 1 && (
                    <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.2 rounded">
                      Front Row / Priority
                    </span>
                  )}
                  {isRearRow && (
                    <span className="text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded">
                      Rear Bench
                    </span>
                  )}
                </div>

                {/* Seat Columns in Row */}
                <div className="grid grid-cols-5 gap-1.5 items-center">
                  {/* Left Side (Columns 0 & 1) */}
                  <div className="col-span-2 flex justify-between gap-1.5">
                    {rowSeats
                      .filter((s) => s.column <= 1)
                      .map((seat) => (
                        <SeatComponent
                          key={seat.id}
                          seat={seat}
                          isSelected={selectedSeat?.seatNumber === seat.seatNumber}
                          onSelect={onSelectSeat}
                          onHover={setHoveredSeat}
                        />
                      ))}
                  </div>

                  {/* Middle Aisle Gap */}
                  <div className="col-span-1 flex justify-center text-slate-700">
                    <div className="w-1 h-8 bg-slate-800/40 rounded-full" />
                  </div>

                  {/* Right Side (Columns 2 & 3) */}
                  <div className="col-span-2 flex justify-between gap-1.5">
                    {rowSeats
                      .filter((s) => s.column >= 2)
                      .map((seat) => (
                        <SeatComponent
                          key={seat.id}
                          seat={seat}
                          isSelected={selectedSeat?.seatNumber === seat.seatNumber}
                          onSelect={onSelectSeat}
                          onHover={setHoveredSeat}
                        />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SHUTTLE REAR BUMPER */}
        <div className="mt-6 pt-3 border-t-2 border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-400 font-mono">
          <span>REAR EMERGENCY EXIT</span>
          <span>OFF-GO SHUTTLE CHASSIS</span>
        </div>

        {/* Hover Floating Tooltip */}
        <AnimatePresence>
          {hoveredSeat && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <SeatTooltip seat={hoveredSeat} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
