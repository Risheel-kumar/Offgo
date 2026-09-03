import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/cards/Card';
import { UserCheck, Users, ShieldCheck, Bus, ArrowRight } from 'lucide-react';

export const QuickManagementCards: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Approve Users',
      description: 'Review pending registration & access requests',
      icon: UserCheck,
      path: '/admin/approvals',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Manage Employees',
      description: 'Directory, departments & pass allowances',
      icon: Users,
      path: '/employees',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    {
      title: 'Manage Drivers',
      description: 'Duty check-ins, license & vehicle assignments',
      icon: ShieldCheck,
      path: '/admin/drivers',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      title: 'Manage Fleet',
      description: 'Shuttle status, EV charge & maintenance logs',
      icon: Bus,
      path: '/admin/shuttles',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Enterprise Quick Management
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              onClick={() => navigate(act.path)}
              className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl border ${act.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
