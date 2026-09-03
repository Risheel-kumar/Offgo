import React from 'react';
import { Table, Column } from '../common/tables/Table';
import { Complaint } from '../../types';
import { Button } from '../common/buttons/Button';
import { Eye, AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading?: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  isLoading,
  onSelectComplaint,
}) => {
  const columns: Column<Complaint>[] = [
    {
      key: 'complaintRef',
      header: 'Complaint ID',
      render: (c) => (
        <div>
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {c.complaintRef}
          </span>
          <p className="text-[10px] text-slate-400 font-mono">{c.id}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Description',
      render: (c) => (
        <div className="max-w-xs">
          <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{c.subject}</p>
          <p className="text-[11px] text-slate-500 truncate">{c.description}</p>
        </div>
      ),
    },
    {
      key: 'raisedBy',
      header: 'Raised By & Role',
      render: (c) => (
        <div>
          <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{c.raisedBy}</p>
          <span className="inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {c.role} {c.department ? `• ${c.department}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (c) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {c.category}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (c) => {
        const colors: Record<string, string> = {
          Critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          High: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          Medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          Low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        };
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[c.priority] || colors.Medium}`}>
            {c.priority}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const statusColors: Record<string, string> = {
          Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          Open: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
          Assigned: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
          'In Progress': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
          Processing: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
          Completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          Resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          Closed: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
        };

        const displayStatus = c.status;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[displayStatus] || statusColors.Pending}`}>
            {displayStatus}
          </span>
        );
      },
    },
    {
      key: 'createdOn',
      header: 'Created On',
      render: (c) => <span className="font-mono text-[11px] text-slate-500">{c.createdOn}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelectComplaint(c)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <Table
        data={complaints}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage="No complaint records match the specified filters."
      />
    </div>
  );
};
