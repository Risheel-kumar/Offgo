import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Calendar, Bell, HelpCircle, PlusCircle, DollarSign } from 'lucide-react';

interface QuickActionsProps {
  onCreateBooking?: () => void;
  onTrackShuttle?: () => void;
  onViewTrips?: () => void;
  onOpenExpenses?: () => void;
  onOpenNotifications?: () => void;
  onOpenSupport?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateBooking,
  onTrackShuttle,
  onViewTrips,
  onOpenExpenses,
  onOpenNotifications,
  onOpenSupport,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'reserve',
      label: 'Reserve Seat',
      icon: PlusCircle,
      onClick: onCreateBooking || (() => navigate('/employee/booking')),
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20',
    },
    {
      id: 'track',
      label: 'Track Ride',
      icon: Compass,
      onClick: onTrackShuttle || (() => navigate('/employee/track')),
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20',
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: Calendar,
      onClick: onViewTrips || (() => navigate('/employee/dashboard')),
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20',
    },
    {
      id: 'expenses',
      label: 'My Expenses',
      icon: DollarSign,
      onClick: onOpenExpenses || (() => navigate('/employee/expenses')),
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onClick: onOpenNotifications || (() => navigate('/notifications')),
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border-teal-500/20',
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      onClick: onOpenSupport || (() => navigate('/support')),
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
        Transportation Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col items-center justify-center text-center gap-1.5 ${act.color} active:scale-[0.98] cursor-pointer`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
