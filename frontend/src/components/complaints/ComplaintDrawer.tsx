import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Complaint, ComplaintStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useUpdateComplaintStatus } from '../../hooks/useComplaints';
import { Button } from '../common/buttons/Button';
import {
  X,
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
  Send,
  MessageSquare,
  ShieldCheck,
  FileText,
  UserCheck,
  Building,
} from 'lucide-react';

interface ComplaintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

export const ComplaintDrawer: React.FC<ComplaintDrawerProps> = ({
  isOpen,
  onClose,
  complaint,
}) => {
  const { user } = useAuth();
  const updateStatusMutation = useUpdateComplaintStatus();

  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [adminResponseInput, setAdminResponseInput] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Pending');

  useEffect(() => {
    if (complaint?.status === 'Completed' || complaint?.status === 'Resolved' || complaint?.status === 'Closed') {
      setSelectedStatus('Completed');
      return;
    }

    if (complaint?.status === 'In Progress' || complaint?.status === 'Processing') {
      setSelectedStatus('In Progress');
      return;
    }

    setSelectedStatus(complaint?.status || 'Pending');
  }, [complaint?.id, complaint?.status]);

  if (!isOpen || !complaint) return null;

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER';

  const handleUpdateStatus = (newStatus: ComplaintStatus) => {
    updateStatusMutation.mutate({
      id: complaint.id,
      status: newStatus,
      adminNotes: adminNotesInput || undefined,
      adminResponse: adminResponseInput || undefined,
      assignedTo: assigneeInput || undefined,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl text-slate-900 dark:text-white"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-500">{complaint.complaintRef}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {complaint.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                  {complaint.subject}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Reporter Information Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Reporter Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{complaint.raisedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Role & Dept</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {complaint.role} {complaint.department ? `(${complaint.department})` : ''}
                  </span>
                </div>
                {complaint.vehicleNumber && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle</span>
                    <span className="font-mono font-bold text-indigo-500">{complaint.vehicleNumber}</span>
                  </div>
                )}
                {complaint.routeName && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Route</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{complaint.routeName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Description
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {complaint.description}
              </p>
              {complaint.attachmentName && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-xl">
                    <FileText className="w-3.5 h-3.5" /> Attachment: {complaint.attachmentName}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Response if available */}
            {complaint.adminResponse && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Official Admin Resolution / Response
                </h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {complaint.adminResponse}
                </p>
              </div>
            )}

            {/* Admin Action Controls (If Admin) */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Admin Actions & Resolution
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-400 text-[10px] uppercase mb-1">Assign To</label>
                    <input
                      type="text"
                      placeholder="e.g. Garage Manager or HR"
                      value={assigneeInput}
                      onChange={(e) => setAssigneeInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-400 text-[10px] uppercase mb-1">Change Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 text-[10px] uppercase mb-1">Public Reply to Employee/Driver</label>
                  <textarea
                    rows={2}
                    placeholder="Enter resolution details visible to reporter..."
                    value={adminResponseInput}
                    onChange={(e) => setAdminResponseInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 text-[10px] uppercase mb-1">Internal Admin Notes</label>
                  <input
                    type="text"
                    placeholder="Internal investigation note..."
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedStatus)}
                    isLoading={updateStatusMutation.isPending}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Update Complaint
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpdateStatus('Completed')}
                    isLoading={updateStatusMutation.isPending}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  >
                    Quick Resolve
                  </Button>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Complaint Activity Timeline
              </h4>
              <div className="relative pl-4 space-y-3 border-l-2 border-slate-200 dark:border-slate-800">
                {complaint.timeline.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {item.action}
                      </span>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        By {item.performedBy} ({item.role}) &bull; {item.timestamp}
                      </p>
                      {item.note && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic mt-0.5">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
