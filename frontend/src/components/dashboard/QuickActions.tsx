import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Car,
  Bus,
  Activity,
  Ticket,
} from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickActionItem[] = [
    {
      id: 'add-emp',
      title: 'Add Employee',
      icon: <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      path: '/admin/users',
      color: 'hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20',
    },
    {
      id: 'add-driver',
      title: 'Add Driver',
      icon: <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      path: '/admin/users',
      color: 'hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
    },
    {
      id: 'add-shuttle',
      title: 'Add Shuttle',
      icon: <Bus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      path: '/admin/shuttles',
      color: 'hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
    },
    {
      id: 'view-fleet',
      title: 'View Live Fleet',
      icon: <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      path: '/admin/tracking',
      color: 'hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20',
    },
    {
      id: 'manage-bookings',
      title: 'Manage Bookings',
      icon: <Ticket className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      path: '/admin/analytics',
      color: 'hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20',
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Quick Actions & Management
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all duration-150 text-left shadow-2xs ${action.color}`}
          >
            <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
              {action.icon}
            </div>
            <span className="truncate">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
