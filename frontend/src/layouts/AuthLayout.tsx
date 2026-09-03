import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bus, ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-900 text-white font-sans antialiased">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 border-r border-slate-800/80 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bus className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">OFF-GO</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Enterprise Security & Real-Time Logistics
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI-Driven Corporate Shuttle Operations
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automated route optimization, real-time geofence tracking, passenger seat reservations, and driver roster synchronization built for enterprise corporate fleets.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-6">
          <span>&copy; {new Date().getFullYear()} Off-Go Technologies</span>
          <span>SOC-2 Certified Platform</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-950 text-slate-100">
        <div className="w-full max-w-md space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
