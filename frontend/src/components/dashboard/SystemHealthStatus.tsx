import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Server, Database, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';

export const SystemHealthStatus: React.FC = () => {
  const healthItems = [
    {
      name: 'Backend Status',
      status: 'OPERATIONAL',
      indicator: 'green',
      latency: '24 ms',
      icon: Server,
    },
    {
      name: 'Database Status',
      status: 'HEALTHY',
      indicator: 'green',
      latency: '12 ms',
      icon: Database,
    },
    {
      name: 'API Status',
      status: 'OPERATIONAL',
      indicator: 'green',
      latency: '45 ms',
      icon: Cpu,
    },
    {
      name: 'Authentication Status',
      status: 'SECURE',
      indicator: 'green',
      latency: '18 ms',
      icon: ShieldCheck,
    },
  ];

  const getIndicatorBadge = (indicator: string) => {
    switch (indicator) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            99.98% Uptime
          </span>
        );
      case 'orange':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Degraded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Offline
          </span>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          Enterprise System Health & Infrastructure
        </CardTitle>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          All Services Normal
        </span>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>

                  {getIndicatorBadge(item.indicator)}
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 font-sans">Response Latency:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.latency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
