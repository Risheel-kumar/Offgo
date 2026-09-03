import React from 'react';
import { EmployeeProfile } from '../../types';
import { Sparkles, Calendar, Sun, Moon, CloudSun, ShieldCheck } from 'lucide-react';

interface WelcomeBannerProps {
  profile: EmployeeProfile | null;
  hasActiveTrip?: boolean;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ profile, hasActiveTrip }) => {
  const name = profile?.fullName || 'Employee';
  const hour = new Date().getHours();

  let greeting = 'Good morning';
  let GreetingIcon = Sun;

  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    GreetingIcon = CloudSun;
  } else if (hour >= 17) {
    greeting = 'Good evening';
    GreetingIcon = Moon;
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-md overflow-hidden border border-slate-800">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <GreetingIcon className="w-4 h-4" />
            <span>{greeting}, {name}!</span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            Off-Go Commute Portal
          </h2>

          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-1">
            {hasActiveTrip
              ? 'Your shuttle is currently in transit. Check live radar for real-time ETA and stop updates.'
              : 'Seamless enterprise transport. Reserve seats, track live shuttles, and manage your daily ride.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-2 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Employee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
