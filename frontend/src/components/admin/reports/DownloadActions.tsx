import React from 'react';
import { Download, FileText, FileSpreadsheet, Printer, Loader2 } from 'lucide-react';
import { ReportDataPayload } from '../../../types/reports';
import { useDownloadReport } from '../../../hooks/useReports';

interface DownloadActionsProps {
  reportData: ReportDataPayload;
}

export const DownloadActions: React.FC<DownloadActionsProps> = ({ reportData }) => {
  const downloadMutation = useDownloadReport();

  const handleDownload = (format: 'PDF' | 'EXCEL' | 'CSV' | 'PRINT') => {
    downloadMutation.mutate({ data: reportData, format });
  };

  const isPending = downloadMutation.isPending;

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        onClick={() => handleDownload('PRINT')}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs border border-slate-200 dark:border-slate-700 disabled:opacity-50"
        title="Print or Save as PDF"
      >
        <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span>Print Report</span>
      </button>

      <button
        onClick={() => handleDownload('PDF')}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        <span>Download PDF</span>
      </button>

      <button
        onClick={() => handleDownload('EXCEL')}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800/60 shadow-xs disabled:opacity-50"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Download Excel</span>
      </button>

      <button
        onClick={() => handleDownload('CSV')}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all border border-blue-200 dark:border-blue-800/60 shadow-xs disabled:opacity-50"
      >
        <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Download CSV</span>
      </button>
    </div>
  );
};
