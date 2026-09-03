import React from 'react';
import { TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { ExecutiveSummaryMetric } from '../../../types/reports';

interface ReportSummaryProps {
  metrics: ExecutiveSummaryMetric[];
  executiveNotes?: string[];
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ metrics, executiveNotes }) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl"
          >
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {metric.label}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {metric.value}
              </span>
              {metric.change && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    metric.trend === 'up'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : metric.trend === 'down'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {metric.trend === 'neutral' && <Minus className="w-3 h-3" />}
                  {metric.change}
                </span>
              )}
            </div>
            {metric.description && (
              <p className="text-[11px] text-slate-400 mt-1">{metric.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Executive Findings / Key Observations */}
      {executiveNotes && executiveNotes.length > 0 && (
        <div className="p-4 sm:p-5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Executive Findings & Key Observations</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-xs text-slate-700 dark:text-slate-300 font-medium">
            {executiveNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
