import React, { useMemo, useState } from 'react';
import { PageHeader } from '../common/headers/PageHeader';
import { Card } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import { ComplaintForm } from './ComplaintForm';
import { ComplaintTable } from './ComplaintTable';
import { ComplaintDrawer } from './ComplaintDrawer';
import { useAuth } from '../../context/AuthContext';
import { useComplaints, useCreateComplaint, useUserComplaints } from '../../hooks/useComplaints';
import { Complaint, ComplaintFilterOptions, CreateComplaintInput } from '../../types';
import {
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  X,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const complaintPriorityOrder: Record<string, number> = {
  Medium: 0,
  Low: 1,
  High: 2,
  Critical: 3,
};

export const ComplaintPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER';

  const [roleFilter, setRoleFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  const filters: ComplaintFilterOptions = {
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    searchQuery: searchQuery || undefined,
  };

  const isUserScopedView = !isAdmin && !!user?.id;
  const { data: adminComplaints = [], isLoading: isAdminComplaintsLoading } = useComplaints(isAdmin);
  const { data: userComplaints = [], isLoading: isUserComplaintsLoading } = useUserComplaints(user?.id ?? '', isUserScopedView);
  const complaints = isUserScopedView ? userComplaints : adminComplaints;
  const isLoading = isUserScopedView ? isUserComplaintsLoading : isAdminComplaintsLoading;
  const createComplaintMutation = useCreateComplaint();

  const sortedComplaints = useMemo(() => {
    let filtered = [...complaints];

    if (filters.role) filtered = filtered.filter((c) => String(c.role) === String(filters.role));
    if (filters.priority) filtered = filtered.filter((c) => String(c.priority) === String(filters.priority));
    if (filters.status) {
      const normalized = String(filters.status).trim().toLowerCase();
      filtered = filtered.filter((c) => String(c.status).trim().toLowerCase() === normalized);
    }
    if (filters.category) filtered = filtered.filter((c) => String(c.category) === String(filters.category));
    if (filters.searchQuery) {
      const q = String(filters.searchQuery).trim().toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.subject.toLowerCase().includes(q) ||
          c.raisedBy.toLowerCase().includes(q) ||
          c.complaintRef.toLowerCase().includes(q)
      );
    }

    if (!isAdmin) return filtered;
    return filtered.sort((first, second) => {
      const firstPriority = complaintPriorityOrder[first.priority] ?? Number.MAX_SAFE_INTEGER;
      const secondPriority = complaintPriorityOrder[second.priority] ?? Number.MAX_SAFE_INTEGER;
      return firstPriority - secondPriority;
    });
  }, [complaints, filters, isAdmin]);

  const handleCreateComplaint = (input: CreateComplaintInput) => {
    if (!user) return;
    createComplaintMutation.mutate(
      {
        input,
        user: {
          id: user.id || 'usr-1',
          name: user.name || 'Commuter',
          role: (user.role === 'DRIVER' ? 'DRIVER' : 'EMPLOYEE'),
          department: user.department,
        },
      },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
  };

  const pendingComplaintsCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Open' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const completedComplaintsCount = complaints.filter(
    (c) => c.status === 'Completed' || c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const criticalCount = complaints.filter((c) => c.priority === 'Critical').length;
  const pendingReviewCount = complaints.filter((c) => c.status === 'Pending' || c.status === 'Open').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={isAdmin ? 'Complaint & Support Management' : 'Help Center & Support Issues'}
        subtitle={
          isAdmin
            ? 'Track, assign, and resolve driver and employee commute issues, vehicle faults, and safety complaints.'
            : 'Raise issues, track status, and receive responses directly from Fleet Management.'
        }
        actions={
          !isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFormOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Raise Complaint
            </Button>
          )
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Pending Complaints</span>
            <h4 className="text-2xl font-black text-amber-500 font-mono">{pendingComplaintsCount}</h4>
            <p className="text-[11px] text-slate-500">Active dispatches</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Completed Tickets</span>
            <h4 className="text-2xl font-black text-emerald-500 font-mono">{completedComplaintsCount}</h4>
            <p className="text-[11px] text-slate-500">Closed & settled</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Critical Priority</span>
            <h4 className="text-2xl font-black text-rose-500 font-mono">{criticalCount}</h4>
            <p className="text-[11px] text-slate-500">Requires immediate action</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Pending Review</span>
            <h4 className="text-2xl font-black text-indigo-500 font-mono">{pendingReviewCount}</h4>
            <p className="text-[11px] text-slate-500">Awaiting assignment</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket subject, reporter, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-full md:w-64"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap text-xs">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="DRIVER">Driver</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Vehicle Issue">Vehicle Issue</option>
              <option value="Driver Behaviour">Driver Behaviour</option>
              <option value="Employee Behaviour">Employee Behaviour</option>
              <option value="Route Issue">Route Issue</option>
              <option value="Delay">Delay</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Safety">Safety</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <ComplaintTable
        complaints={sortedComplaints}
        isLoading={isLoading}
        onSelectComplaint={(c) => setActiveComplaint(c)}
      />

      {/* Raise Complaint Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" /> Raise New Complaint / Issue
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ComplaintForm
                onSubmit={handleCreateComplaint}
                isLoading={createComplaintMutation.isPending}
                onCancel={() => setIsFormOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Complaint Detail Drawer */}
      <ComplaintDrawer
        isOpen={Boolean(activeComplaint)}
        onClose={() => setActiveComplaint(null)}
        complaint={activeComplaint}
      />
    </div>
  );
};
