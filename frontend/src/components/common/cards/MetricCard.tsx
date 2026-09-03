import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../../utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
    timeframe?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  subtext?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBgColor = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  subtext,
  className,
}) => {
  return (
    <Card className={cn('hover:border-slate-300 dark:hover:border-slate-700 transition-all', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </div>
          </div>
          {icon && (
            <div className={cn('p-2.5 rounded-lg flex items-center justify-center shrink-0', iconBgColor)}>
              {icon}
            </div>
          )}
        </div>

        {(change || subtext) && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            {change && (
              <span
                className={cn(
                  'inline-flex items-center font-semibold px-2 py-0.5 rounded text-xs',
                  change.type === 'increase' &&
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
                  change.type === 'decrease' &&
                    'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
                  change.type === 'neutral' &&
                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                {change.type === 'increase' && <TrendingUp className="w-3.5 h-3.5 mr-1" />}
                {change.type === 'decrease' && <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {change.type === 'neutral' && <Minus className="w-3.5 h-3.5 mr-1" />}
                {change.value}
              </span>
            )}
            <span className="text-slate-500 dark:text-slate-400">
              {change?.timeframe || subtext}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
