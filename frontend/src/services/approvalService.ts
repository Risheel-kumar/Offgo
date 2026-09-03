import apiClient from '../api/axios';
import {
  UserApprovalRequest,
  UserApprovalFilterOptions,
} from '../types';

let mockApprovalRequests: UserApprovalRequest[] = [
  {
    id: 'req-201',
    userId: 'usr-501',
    fullName: 'David Hassel',
    email: 'david.hassel@company.com',
    phone: '+1 (555) 234-8901',
    role: 'EMPLOYEE',
    department: 'Software Engineering',
    employeeIdOrDriverId: 'EMP-9901',
    registrationDate: '2026-07-21 09:30 AM',
    status: 'PENDING',
  },
  {
    id: 'req-202',
    userId: 'usr-502',
    fullName: 'Carlos Santana',
    email: 'carlos.santana@fleet.offgo.com',
    phone: '+1 (555) 482-1190',
    role: 'DRIVER',
    employeeIdOrDriverId: 'DRV-4011',
    registrationDate: '2026-07-21 11:15 AM',
    status: 'PENDING',
  },
  {
    id: 'req-203',
    userId: 'usr-503',
    fullName: 'Samantha Miller',
    email: 'samantha.m@company.com',
    phone: '+1 (555) 890-3412',
    role: 'EMPLOYEE',
    department: 'Global Supply Chain',
    employeeIdOrDriverId: 'EMP-9903',
    registrationDate: '2026-07-20 04:45 PM',
    status: 'PENDING',
  },
  {
    id: 'req-204',
    userId: 'usr-504',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@fleet.offgo.com',
    phone: '+1 (555) 671-8892',
    role: 'DRIVER',
    employeeIdOrDriverId: 'DRV-4014',
    registrationDate: '2026-07-20 02:10 PM',
    status: 'APPROVED',
    reviewedBy: 'Admin Ops',
    reviewedAt: '2026-07-20 03:00 PM',
  },
  {
    id: 'req-205',
    userId: 'usr-505',
    fullName: 'Jennifer Vance',
    email: 'jennifer.vance@external.com',
    phone: '+1 (555) 123-9900',
    role: 'EMPLOYEE',
    department: 'Contractor',
    employeeIdOrDriverId: 'EMP-9999',
    registrationDate: '2026-07-19 10:00 AM',
    status: 'REJECTED',
    rejectionReason: 'Unverified external email domain. Contractor approval required from HR lead.',
    reviewedBy: 'Admin Ops',
    reviewedAt: '2026-07-19 11:30 AM',
  },
];

const APPROVAL_STORAGE_KEY = 'offgo_approval_requests';

const getStoredApprovals = (): UserApprovalRequest[] => {
  try {
    const raw = localStorage.getItem(APPROVAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore JSON error
  }
  return mockApprovalRequests;
};

const setStoredApprovals = (data: UserApprovalRequest[]) => {
  try {
    localStorage.setItem(APPROVAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore storage error
  }
};

export const approvalService = {
  /**
   * GET /api/v1/admin/approvals
   */
  getApprovalRequests: async (filters?: UserApprovalFilterOptions): Promise<UserApprovalRequest[]> => {
    try {
      const response = await apiClient.get<any>('/admin/approvals', { params: filters });
      const rawList = response.data?.data || response.data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        setStoredApprovals(rawList);
        return rawList;
      }
      return getStoredApprovals();
    } catch {
      let results = getStoredApprovals();

      if (filters) {
        const { searchQuery, roleFilter, statusFilter, departmentFilter } = filters;

        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          results = results.filter(
            (r) =>
              r.fullName.toLowerCase().includes(q) ||
              r.email.toLowerCase().includes(q) ||
              r.employeeIdOrDriverId.toLowerCase().includes(q) ||
              (r.department && r.department.toLowerCase().includes(q))
          );
        }

        if (roleFilter && roleFilter !== 'ALL') {
          results = results.filter((r) => r.role === roleFilter);
        }

        if (statusFilter && statusFilter !== 'ALL') {
          results = results.filter((r) => r.status === statusFilter);
        }

        if (departmentFilter && departmentFilter !== 'ALL') {
          results = results.filter((r) => r.department === departmentFilter);
        }
      }

      return results;
    }
  },

  /**
   * POST /api/v1/admin/approvals/{id}/approve
   */
  approveUser: async (id: string): Promise<UserApprovalRequest> => {
    try {
      const response = await apiClient.post<any>(`/admin/approvals/${id}/approve`);
      const updated = response.data?.data || response.data;
      
      const current = getStoredApprovals();
      const idx = current.findIndex((r) => r.id === id || r.userId === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updated, status: 'APPROVED' };
        setStoredApprovals(current);
      }
      return updated;
    } catch {
      const current = getStoredApprovals();
      const idx = current.findIndex((r) => r.id === id || r.userId === id);
      if (idx === -1) {
        throw new Error(`Approval request with ID ${id} not found.`);
      }

      const updated: UserApprovalRequest = {
        ...current[idx],
        status: 'APPROVED',
        reviewedBy: 'Admin System',
        reviewedAt: new Date().toLocaleString(),
      };

      current[idx] = updated;
      setStoredApprovals(current);
      return updated;
    }
  },

  /**
   * POST /api/v1/admin/approvals/{id}/reject
   */
  rejectUser: async (id: string, reason?: string): Promise<UserApprovalRequest> => {
    try {
      const response = await apiClient.post<any>(`/admin/approvals/${id}/reject`, { reason });
      const updated = response.data?.data || response.data;
      
      const current = getStoredApprovals();
      const idx = current.findIndex((r) => r.id === id || r.userId === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updated, status: 'REJECTED', rejectionReason: reason };
        setStoredApprovals(current);
      }
      return updated;
    } catch {
      const current = getStoredApprovals();
      const idx = current.findIndex((r) => r.id === id || r.userId === id);
      if (idx === -1) {
        throw new Error(`Approval request with ID ${id} not found.`);
      }

      const updated: UserApprovalRequest = {
        ...current[idx],
        status: 'REJECTED',
        rejectionReason: reason || 'Registration request declined by system administrator.',
        reviewedBy: 'Admin System',
        reviewedAt: new Date().toLocaleString(),
      };

      current[idx] = updated;
      setStoredApprovals(current);
      return updated;
    }
  },
};
