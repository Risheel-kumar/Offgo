import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3"></div>
        ))}
      </div>

      {/* Statistics Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded mt-4"></div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"></div>
        <div className="h-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"></div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"></div>
        <div className="h-96 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"></div>
      </div>
    </div>
  );
};
