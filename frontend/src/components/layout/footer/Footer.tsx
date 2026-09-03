import React from 'react';
import { Bus, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Bus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="font-bold text-slate-700 dark:text-slate-300">Off-Go Platform</span>
        <span>&copy; {new Date().getFullYear()} Corporate Shuttle Operations SaaS</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> System Operational
        </span>
        <span className="text-[11px] font-mono text-slate-400">v1.0.0-PROD</span>
      </div>
    </footer>
  );
};
