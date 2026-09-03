import React from 'react';

export const EmployeeSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-1">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              </div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
