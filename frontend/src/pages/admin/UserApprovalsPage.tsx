import React, { useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/cards/Card';
import { Table, Column } from '../../components/common/tables/Table';
import { Button } from '../../components/common/buttons/Button';
import { Input } from '../../components/common/inputs/Input';
import { Modal } from '../../components/common/dialogs/Modal';
import { usePendingApprovals, useApproveUser, useRejectUser } from '../../hooks/useApprovals';
import { UserApprovalRequest, Role } from '../../types';
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ShieldAlert,
  Users,
  Truck,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UserApprovalsPage: React.FC = () => {
  const [activeRoleTab, setActiveRoleTab] = useState<'ALL' | 'EMPLOYEE' | 'DRIVER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Reject Modal State
  const [selectedRequest, setSelectedRequest] = useState<UserApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { requests, isLoading, invalidateApprovals } = usePendingApprovals({
    roleFilter: activeRoleTab,
    statusFilter: statusFilter,
    searchQuery: searchQuery,
  });

  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();

  const handleApprove = async (req: UserApprovalRequest) => {
    try {
      await approveMutation.mutateAsync(req.id);
      toast.success(`Approved ${req.fullName} (${req.role}) access request!`);
    } catch {
      toast.error('Failed to approve request. Please try again.');
    }
  };

  const handleOpenRejectModal = (req: UserApprovalRequest) => {
    setSelectedRequest(req);
    setRejectionReason('Unverified department credentials or domain.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;

    try {
      await rejectMutation.mutateAsync({ id: selectedRequest.id, reason: rejectionReason });
      toast.success(`Declined access request for ${selectedRequest.fullName}`);
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
    } catch {
      toast.error('Failed to decline request.');
    }
  };

  // Metrics
  const totalPending = requests.filter((r) => r.status === 'PENDING').length;
  const employeesPending = requests.filter((r) => r.status === 'PENDING' && r.role === 'EMPLOYEE').length;
  const driversPending = requests.filter((r) => r.status === 'PENDING' && r.role === 'DRIVER').length;
  const approvedTotal = requests.filter((r) => r.status === 'APPROVED').length;

  const columns: Column<UserApprovalRequest>[] = [
    {
      key: 'fullName',
      header: 'Applicant Name & Email',
      render: (r) => (
        <div>
          <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            {r.fullName}
            <span
              className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                r.role === 'EMPLOYEE'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }`}
            >
              {r.role}
            </span>
          </p>
          <p className="text-xs text-slate-500 font-mono">{r.email}</p>
        </div>
      ),
    },
    {
      key: 'employeeIdOrDriverId',
      header: 'Work ID & Dept',
      render: (r) => (
        <div>
          <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {r.employeeIdOrDriverId}
          </p>
          <p className="text-xs text-slate-500">{r.department || 'Transit Operations'}</p>
        </div>
      ),
    },
    {
      key: 'registrationDate',
      header: 'Submitted On',
      render: (r) => <span className="text-xs text-slate-500 font-mono">{r.registrationDate}</span>,
    },
    {
      key: 'status',
      header: 'Approval Status',
      render: (r) => (
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
              r.status === 'APPROVED'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : r.status === 'REJECTED'
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                : 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse'
            }`}
          >
            {r.status === 'APPROVED' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : r.status === 'REJECTED' ? (
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            )}
            {r.status}
          </span>
          {r.status === 'REJECTED' && r.rejectionReason && (
            <p className="text-[10px] text-rose-500 truncate max-w-xs mt-1" title={r.rejectionReason}>
              Reason: {r.rejectionReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Review Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status === 'PENDING' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(r)}
                isLoading={approveMutation.isPending}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleOpenRejectModal(r)}
                leftIcon={<UserX className="w-3.5 h-3.5" />}
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Reviewed by {r.reviewedBy || 'Admin'}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="User Approval Center"
        subtitle="Review, approve, or decline corporate registration requests for employees and fleet drivers."
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Pending</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalPending}</h3>
            <p className="text-[11px] text-amber-600 font-semibold">Requires Action</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pending Employees</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{employeesPending}</h3>
            <p className="text-[11px] text-slate-500">Corporate SSO</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pending Drivers</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{driversPending}</h3>
            <p className="text-[11px] text-slate-500">Fleet Operations</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Approved</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{approvedTotal}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold">Active Roster</p>
          </div>
        </Card>
      </div>

      {/* Filter and Role Tabs Toolbar */}
      <Card className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['ALL', 'EMPLOYEE', 'DRIVER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRoleTab(r)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeRoleTab === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>

        <div className="flex flex-1 max-w-md items-center gap-2">
          <Input
            placeholder="Search name, email, or work ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table
            columns={columns}
            data={requests}
            keyExtractor={(r) => r.id}
            isLoading={isLoading}
            emptyMessage="No registration approval requests found matching filters."
          />
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject User Registration"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Declining access for <strong>{selectedRequest?.fullName}</strong> will block them from logging in.
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select or Enter Rejection Reason
            </label>
            <select
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              <option value="Unverified department credentials or domain.">
                Unverified department credentials or domain.
              </option>
              <option value="Contractor approval required from HR lead.">
                Contractor approval required from HR lead.
              </option>
              <option value="Invalid driver license or background check.">
                Invalid driver license or background check.
              </option>
              <option value="Duplicate account request.">Duplicate account request.</option>
            </select>
          </div>

          <Input
            label="Custom Note / Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Type reason for applicant..."
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
              isLoading={rejectMutation.isPending}
              leftIcon={<UserX className="w-4 h-4" />}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
