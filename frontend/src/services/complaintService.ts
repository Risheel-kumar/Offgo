import apiClient from '../api/axios';
import {
  Complaint,
  CreateComplaintInput,
  ComplaintFilterOptions,
  ComplaintStatus,
} from '../types';

const priorityOrder: Record<string, number> = {
  Medium: 0,
  Low: 1,
  High: 2,
  Critical: 3,
};

const normalizeComplaintStatus = (status?: string): ComplaintStatus => {
  const normalized = String(status ?? '').trim();
  const key = normalized.toUpperCase().replace(/\s+/g, '_');

  switch (key) {
    case 'PENDING':
      return 'Pending';
    case 'OPEN':
      return 'Open';
    case 'ASSIGNED':
      return 'Assigned';
    case 'PROCESSING':
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
      return 'Closed';
    default:
      return 'Pending';
  }
};

const toBackendComplaintStatus = (status: ComplaintStatus): string => {
  switch (status) {
    case 'Pending':
      return 'PENDING';
    case 'Open':
      return 'OPEN';
    case 'Assigned':
      return 'ASSIGNED';
    case 'In Progress':
    case 'Processing':
      return 'IN_PROGRESS';
    case 'Completed':
      return 'COMPLETED';
    case 'Resolved':
      return 'RESOLVED';
    case 'Closed':
      return 'CLOSED';
    default:
      return 'PENDING';
  }
};

const normalizeCategory = (category?: string): Complaint['category'] => {
  const map: Record<string, Complaint['category']> = {
    VEHICLE_ISSUE: 'Vehicle Issue',
    DRIVER_BEHAVIOUR: 'Driver Behaviour',
    EMPLOYEE_BEHAVIOUR: 'Employee Behaviour',
    ROUTE_ISSUE: 'Route Issue',
    DELAY: 'Delay',
    MAINTENANCE: 'Maintenance',
    SAFETY: 'Safety',
    SUGGESTION: 'Suggestion',
    OTHER: 'Other',
  };
  return map[String(category ?? '').toUpperCase()] ?? 'Other';
};

const normalizePriority = (priority?: string): Complaint['priority'] => {
  const map: Record<string, Complaint['priority']> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };
  return map[String(priority ?? '').toUpperCase()] ?? 'Medium';
};

const toFrontendComplaint = (item: any): Complaint => ({
  id: String(item.id),
  complaintRef: item.complaintRef || item.complaint_ref || `TKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  subject: item.subject || 'Untitled complaint',
  category: normalizeCategory(item.category),
  priority: normalizePriority(item.priority),
  status: normalizeComplaintStatus(item.status),
  description: item.description || '',
  raisedBy: item.raisedBy || 'Unknown user',
  raisedById: String(item.raisedById ?? item.raised_by_id ?? 'anonymous'),
  role: item.role === 'DRIVER' ? 'DRIVER' : 'EMPLOYEE',
  department: item.department,
  vehicleNumber: item.vehicleNumber,
  routeName: item.routeName,
  assignedTo: item.assignedTo,
  createdOn: item.createdAt || item.createdOn || new Date().toISOString(),
  updatedOn: item.updatedAt || item.updatedOn || item.createdAt || new Date().toISOString(),
  adminResponse: item.adminResponse,
  adminNotes: item.adminNotes,
  attachmentName: item.attachmentName,
  timeline: Array.isArray(item.timeline)
    ? item.timeline.map((entry: any) => ({
        id: String(entry.id),
        action: entry.action || 'Status update',
        performedBy: entry.performedBy || 'System',
        role: entry.role === 'ADMIN' ? 'ADMIN' : entry.role === 'DRIVER' ? 'DRIVER' : 'EMPLOYEE',
        timestamp: entry.timestamp || new Date().toISOString(),
        note: entry.note,
      }))
    : [],
});

const complaintStatusOrder: Record<ComplaintStatus, number> = {
  Pending: 0,
  Open: 1,
  Assigned: 2,
  'In Progress': 3,
  Completed: 4,
  Resolved: 5,
  Closed: 6,
  Processing: 3,
};

const applyFilters = (items: Complaint[], filters?: ComplaintFilterOptions) => {
  let filtered = [...items];

  if (filters?.role) filtered = filtered.filter((c) => String(c.role) === String(filters.role));
  if (filters?.priority) filtered = filtered.filter((c) => String(c.priority) === String(filters.priority));
  if (filters?.status) {
    const status = String(filters.status).trim().toLowerCase();
    filtered = filtered.filter((c) => normalizeComplaintStatus(c.status).trim().toLowerCase() === status);
  }
  if (filters?.category) filtered = filtered.filter((c) => String(c.category) === String(filters.category));
  if (filters?.searchQuery) {
    const q = String(filters.searchQuery).trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.raisedBy.toLowerCase().includes(q) ||
        c.complaintRef.toLowerCase().includes(q)
    );
  }

  return filtered.sort((a, b) => {
    const statusDelta = (complaintStatusOrder[normalizeComplaintStatus(a.status)] ?? 99) - (complaintStatusOrder[normalizeComplaintStatus(b.status)] ?? 99);
    if (statusDelta !== 0) return statusDelta;

    const priorityDelta = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
    if (priorityDelta !== 0) return priorityDelta;

    return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
  });
};

export const complaintService = {
  getComplaints: async (): Promise<Complaint[]> => {
    const response = await apiClient.get('/complaints');
    const payload = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    return payload.map(toFrontendComplaint);
  },

  getComplaintsByUser: async (userId: string): Promise<Complaint[]> => {
    const response = await apiClient.get(`/complaints/user/${userId}`);
    const payload = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    return payload
      .map(toFrontendComplaint)
      .filter((c) => String(c.raisedById) === String(userId));
  },

  createComplaint: async (
    input: CreateComplaintInput,
    user: { id: string; name: string; role: 'EMPLOYEE' | 'DRIVER'; department?: string }
  ): Promise<Complaint> => {
    const backendCategory = input.category
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .toUpperCase();

    const backendPriority = input.priority.toUpperCase();

    const response = await apiClient.post('/complaints', {
      subject: input.subject,
      category: backendCategory,
      priority: backendPriority,
      description: input.description,
      attachmentName: input.attachmentName,
    }, {
      params: {
        raisedById: user.id,
        raisedByName: user.name,
        role: user.role,
        department: user.department,
      },
    });

    const data = response.data?.data ?? response.data;
    return toFrontendComplaint(data);
  },

  updateComplaintStatus: async (
    id: string,
    status: ComplaintStatus,
    adminNotes?: string,
    adminResponse?: string,
    assignedTo?: string,
    adminUser = 'System Administrator'
  ): Promise<Complaint> => {
    const response = await apiClient.put(`/complaints/${id}/status`, {
      status: toBackendComplaintStatus(status),
      adminNotes,
      adminResponse,
      assignedTo,
    }, {
      params: { adminUserName: adminUser },
    });

    const data = response.data?.data ?? response.data;
    return toFrontendComplaint(data);
  },
};
