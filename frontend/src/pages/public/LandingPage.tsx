import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Navigation, Wallet, ArrowRight, ShieldCheck, MapPin, Building2, Users, BarChart3, Clock } from 'lucide-react';
import { Button } from '../../components/common/buttons/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Bus className="w-4 h-4 text-indigo-400" /> Enterprise Commute & Fleet Operations Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Streamlined Enterprise Shuttle & Fleet Management
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Streamline employee transportation with live Google Maps shuttle tracking, driver route navigation, monthly transport expense analytics, and centralized fleet operations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/login">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Open Enterprise Portal
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto hover:bg-slate-800 transition-all"
            >
              Request Fleet Access
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 shadow-xl group">
          <div className="p-3.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 w-fit group-hover:scale-110 transition-transform">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Live Fleet Operations</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Monitor every active shuttle in real time with Google Maps integration, live vehicle location, route progress, speed, ETA, remaining distance, and operational status from a centralized Fleet Operations dashboard.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 shadow-xl group">
          <div className="p-3.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 w-fit group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Smart Transport Expense Management</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Automatically calculate employee transportation usage, monthly travel expenses, trip history, and department-wise analytics, enabling administrators to generate detailed reports for payroll and incentive processing.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 shadow-xl group">
          <div className="p-3.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 w-fit group-hover:scale-110 transition-transform">
            <Navigation className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Driver Navigation & Route Execution</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Provide drivers with intelligent route guidance, assigned pickup stops, live Google Maps navigation, trip progress tracking, passenger boarding overview, and office-bound route execution from a single dashboard.
          </p>
        </div>
      </div>

      {/* Highlights Summary Grid */}
      <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <span className="text-3xl font-black text-white font-mono">100%</span>
          <span className="text-xs text-slate-400 font-medium block">Live Google Maps GPS Sync</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl font-black text-emerald-400 font-mono">Real-time</span>
          <span className="text-xs text-slate-400 font-medium block">Driver Waypoint Navigation</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl font-black text-indigo-400 font-mono">Automated</span>
          <span className="text-xs text-slate-400 font-medium block">Monthly Expense Reports</span>
        </div>
        <div className="space-y-1">
          <span className="text-3xl font-black text-purple-400 font-mono">Enterprise</span>
          <span className="text-xs text-slate-400 font-medium block">Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};

