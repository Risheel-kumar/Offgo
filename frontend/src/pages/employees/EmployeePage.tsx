import React, { useState, useMemo } from 'react';
import { useEmployees, useCreateEmployee, useDeleteEmployee } from '../../hooks/useEmployees';
import { EmployeeHeader } from '../../components/employees/EmployeeHeader';
import { EmployeeToolbar } from '../../components/employees/EmployeeToolbar';
import { EmployeeTable } from '../../components/employees/EmployeeTable';
import { EmployeeForm } from '../../components/employees/EmployeeForm';
import { EmployeeDetailsDrawer } from '../../components/employees/EmployeeDetailsDrawer';
import { DeleteEmployeeDialog } from '../../components/employees/DeleteEmployeeDialog';
import { EmployeeSkeleton } from '../../components/employees/EmployeeSkeleton';
import { EmptyState } from '../../components/employees/EmptyState';
import { Employee, EmployeeFilterOptions, CreateEmployeePayload } from '../../types';
import toast from 'react-hot-toast';

export const EmployeePage: React.FC = () => {
  const [filters, setFilters] = useState<EmployeeFilterOptions>({
    searchQuery: '',
    statusFilter: 'ALL',
    departmentFilter: 'ALL',
    shuttleFilter: 'ALL',
    bookingStatusFilter: 'ALL',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const { employees, allEmployees, isLoading, isFetching, refetch } = useEmployees(filters);
  const createEmployeeMutation = useCreateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const handleFilterChange = (newFilters: Partial<EmployeeFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'ALL',
      departmentFilter: 'ALL',
      shuttleFilter: 'ALL',
      bookingStatusFilter: 'ALL',
    });
  };

  const handleCreateEmployee = async (payload: CreateEmployeePayload) => {
    await createEmployeeMutation.mutateAsync(payload);
  };

  const handleDeleteEmployee = async (emp: Employee) => {
    try {
      await deleteEmployeeMutation.mutateAsync(emp.id);
      toast.success(`Employee ${emp.name} removed successfully.`);
    } catch {
      toast.error('Failed to delete employee record.');
    }
  };

  const handleExportCSV = () => {
    if (employees.length === 0) {
      toast.error('No employees available to export.');
      return;
    }

    const headers = ['EMP ID', 'Name', 'Email', 'Phone', 'Department', 'Status', 'Shuttle', 'Created Date'];
    const rows = employees.map((e) => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      e.phone,
      e.department,
      e.status,
      e.assignedShuttle ? e.assignedShuttle.vehicleNumber : 'None',
      e.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OffGo_Employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Employee records exported to CSV!');
  };

  const departments = useMemo(() => {
    const set = new Set(allEmployees.map((e) => e.department));
    return Array.from(set);
  }, [allEmployees]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <EmployeeHeader
        onAddEmployee={() => setIsAddModalOpen(true)}
        onRefresh={() => refetch()}
        onExportCSV={handleExportCSV}
        isRefreshing={isFetching}
        totalEmployeesCount={allEmployees.length}
      />

      {/* Toolbar with Search and Filters */}
      <EmployeeToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        departments={departments}
      />

      {/* Content Area */}
      {isLoading ? (
        <EmployeeSkeleton />
      ) : employees.length === 0 ? (
        <EmptyState
          onAddEmployee={() => setIsAddModalOpen(true)}
          title="No Employee Records Found"
          description="Try adjusting your search keywords, department filters, or account status selection."
        />
      ) : (
        <EmployeeTable
          employees={employees}
          onViewDetails={(emp) => setSelectedEmployee(emp)}
          onDelete={(emp) => setEmployeeToDelete(emp)}
        />
      )}

      {/* Add Employee Modal */}
      <EmployeeForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
        isLoading={createEmployeeMutation.isPending}
      />

      {/* Right-side Details Drawer */}
      <EmployeeDetailsDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* Danger Delete Confirmation Dialog */}
      <DeleteEmployeeDialog
        employee={employeeToDelete}
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteEmployee}
        isLoading={deleteEmployeeMutation.isPending}
      />
    </div>
  );
};

export default EmployeePage;
