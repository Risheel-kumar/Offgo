import React from 'react';
import { Card } from '../common/cards/Card';
import { Ticket, DollarSign, Users, ShieldCheck, Bus } from 'lucide-react';

export const TodaysOperations: React.FC = () => {
  const operations = [
    {
      title: "Today's Bookings",
      value: '342',
      badge: '+18% vs Yesterday',
      icon: Ticket,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      title: "Today's Revenue Placeholder",
      value: '$3,850',
      badge: 'Employer Subsidized Value',
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Employees Travelling',
      value: '298',
      badge: '87% Capacity Utilized',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Drivers On Duty',
      value: '22',
      badge: '100% Shift Coverage',
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      title: 'Vehicles Running',
      value: '16',
      badge: 'EV & Diesel Fleet',
      icon: Bus,
      color: 'text-teal-500 bg-teal-500/10',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Today's Operations Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {operations.map((op) => {
          const Icon = op.icon;
          return (
            <Card key={op.title} className="p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  {op.title}
                </span>
                <div className={`p-2 rounded-xl ${op.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {op.value}
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {op.badge}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
