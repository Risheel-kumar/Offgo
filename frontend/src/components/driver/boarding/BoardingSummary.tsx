import React from 'react';
import { Card, CardContent } from '../../common/cards/Card';
import { Route, MapPin, Navigation, Clock, Users, Building2, Flag } from 'lucide-react';

interface BoardingSummaryProps {
  routeName: string;
  totalStops: number;
  currentStopName: string;
  remainingStopsCount: number;
  totalEmployees: number;
  expectedAtCurrentStop: number;
  estimatedArrivalAtOffice: string;
}

export const BoardingSummary: React.FC<BoardingSummaryProps> = ({
  routeName,
  totalStops,
  currentStopName,
  remainingStopsCount,
  totalEmployees,
  expectedAtCurrentStop,
  estimatedArrivalAtOffice,
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md">
      <CardContent className="p-5 space-y-4">
        {/* Top Bar: Today's Route Title & Main Route Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {routeName}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Current Stop: <span className="text-emerald-400 font-bold">{currentStopName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3.5 py-2 rounded-2xl shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">EST. ARRIVAL AT OFFICE</span>
              <span className="text-sm font-extrabold text-white font-mono">{estimatedArrivalAtOffice}</span>
            </div>
          </div>
        </div>

        {/* 6 Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Today's Route / Total Stops */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase">TOTAL STOPS</span>
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-xl font-extrabold text-white font-mono">{totalStops}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Route Waypoints</span>
          </div>

          {/* Current Stop */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase">CURRENT STOP</span>
              <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <span className="text-sm font-extrabold text-emerald-400 font-mono truncate">{currentStopName}</span>
            <span className="text-[10px] text-emerald-400/80 font-medium mt-0.5">Active Location</span>
          </div>

          {/* Remaining Stops */}
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase">REMAINING STOPS</span>
              <Flag className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xl font-extrabold text-purple-400 font-mono">{remainingStopsCount}</span>
            <span className="text-[10px] text-purple-400/80 font-medium mt-0.5">To Destination</span>
          </div>

          {/* Total Employees */}
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase">TOTAL EMPLOYEES</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-xl font-extrabold text-indigo-400 font-mono">{totalEmployees}</span>
            <span className="text-[10px] text-indigo-400/80 font-medium mt-0.5">Assigned Shift</span>
          </div>

          {/* Expected Employees at Current Stop */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase font-sans">CURRENT STOP EXPECTED</span>
              <Users className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl font-extrabold text-amber-400 font-mono">{expectedAtCurrentStop}</span>
            <span className="text-[10px] text-amber-400/80 font-medium mt-0.5">At Active Stop</span>
          </div>

          {/* Estimated Arrival */}
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase">OFFICE ARRIVAL</span>
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-extrabold text-blue-400 font-mono truncate">{estimatedArrivalAtOffice}</span>
            <span className="text-[10px] text-blue-400/80 font-medium mt-0.5">Final HQ ETA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
