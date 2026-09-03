import apiClient from '../api/axios';
import { Employee, CreateEmployeePayload } from '../types';

const unwrap = (response: any) => response.data?.data ?? response.data;

const mapEmployee = (employee: any): Employee => ({
  id: String(employee.id),
  employeeId: employee.employeeCode || employee.employeeId || '',
  firstName: employee.firstName || '',
  lastName: employee.lastName || '',
  name: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
  email: employee.email || '',
  phone: employee.phoneNumber || employee.phone || '',
  department: employee.department || '',
  status: employee.active === false ? 'INACTIVE' : 'ACTIVE',
  createdAt: employee.createdAt || '',
  updatedAt: employee.updatedAt || '',
  address: employee.address,
  assignedShuttle: employee.assignedShuttle,
  currentBooking: employee.currentBooking,
  emergencyContact: employee.emergencyContact,
  attendanceSummary: employee.attendanceSummary,
});

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get('/employees');
    return (unwrap(response) as any[]).map(mapEmployee);
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get(`/employees/${id}`);
    return mapEmployee(unwrap(response));
  },

  createEmployee: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const departmentMap: Record<string, string> = {
      'PRODUCT & DESIGN': 'ENGINEERING',
      'HUMAN RESOURCES': 'HR',
      'FINANCE & LEGAL': 'FINANCE',
      'SALES & MARKETING': 'SALES',
    };
    const departmentLabel = payload.department.trim().toUpperCase();
    const response = await apiClient.post('/employees', {
      employeeCode: payload.employeeId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phone.replace(/\D/g, '').slice(-10),
      department: departmentMap[departmentLabel] || departmentLabel,
    });
    return mapEmployee(unwrap(response));
  },

  deleteEmployee: async (id: string): Promise<{ success: boolean; id: string }> => {
    await apiClient.delete(`/employees/${id}`);
    return { success: true, id };
  },
};
