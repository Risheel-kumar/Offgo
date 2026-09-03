 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShuttleHeader } from '../../components/shuttles/ShuttleHeader';
import { ShuttleToolbar } from '../../components/shuttles/ShuttleToolbar';
import { ShuttleTable } from '../../components/shuttles/ShuttleTable';
import { ShuttleForm } from '../../components/shuttles/ShuttleForm';
import {
  useShuttles,
  useCreateShuttle,
  useUpdateShuttle,
  useDeleteShuttle,
} from '../../hooks/useShuttles';
import {
  ShuttleDetailItem,
  ShuttleFilterOptions,
  CreateShuttlePayload,
  UpdateShuttlePayload,
} from '../../types';

const initialFilters: ShuttleFilterOptions = {
  searchQuery: '',
  statusFilter: 'ALL',
  capacityFilter: 'ALL',
  vehicleTypeFilter: 'ALL',
  driverFilter: 'ALL',
  routeFilter: 'ALL',
  fuelTypeFilter: 'ALL',
};

export const ShuttleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ShuttleFilterOptions>(initialFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shuttleToEdit, setShuttleToEdit] = useState<ShuttleDetailItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { shuttles, allShuttles, isLoading, isFetching, refetch } = useShuttles(filters);
  const createMutation = useCreateShuttle();
  const updateMutation = useUpdateShuttle();
  const deleteMutation = useDeleteShuttle();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFilterChange = (updated: Partial<ShuttleFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleOpenAddForm = () => {
    setShuttleToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (shuttle: ShuttleDetailItem) => {
    setShuttleToEdit(shuttle);
    setIsFormOpen(true);
  };

  const handleSelectShuttle = (shuttle: ShuttleDetailItem) => {
    navigate(`/admin/routes?shuttleId=${encodeURIComponent(shuttle.id)}`);
  };

  const handleFormSubmit = async (data: CreateShuttlePayload | UpdateShuttlePayload) => {
    if ('id' in data) {
      await updateMutation.mutateAsync(data);
      showToast(`Shuttle ${data.vehicleNumber} updated successfully.`);
    } else {
      await createMutation.mutateAsync(data);
      showToast(`Shuttle ${data.vehicleNumber} registered successfully.`);
    }
  };

  const handleDeleteShuttle = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this shuttle vehicle from fleet registry?')) {
      try {
        await deleteMutation.mutateAsync(id);
        showToast('Shuttle deleted from fleet registry.');
      } catch (error: any) {
        showToast(error?.response?.data?.message || 'Unable to delete shuttle.');
      }
    }
  };

  const handleExportCSV = () => {
    if (!allShuttles || allShuttles.length === 0) return;

    const headers = [
      'Vehicle Number',
      'Vehicle Type',
      'Manufacturer',
      'Model',
      'Capacity',
      'Status',
      'Driver Name',
      'Route Name',
      'Registration Number',
      'Registration Date',
    ];

    const rows: string[][] = allShuttles.map((s: ShuttleDetailItem) => [
      s.vehicleNumber,
      s.vehicleType,
      s.manufacturer,
      s.model,
      String(s.capacity),
      s.status,
      s.assignedDriver ? s.assignedDriver.name : 'Unassigned',
      s.assignedRoute ? s.assignedRoute.name : 'Unassigned',
      s.registrationNumber,
      s.registrationDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row: string[]) => row.map((value: string) => `"${value}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OffGo_Fleet_Shuttles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Fleet shuttles exported as CSV.');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <ShuttleHeader
        onAddShuttle={handleOpenAddForm}
        onRefresh={() => refetch()}
        onExportCSV={handleExportCSV}
        isRefreshing={isFetching}
        totalShuttlesCount={allShuttles.length}
      />

      {/* Search & Multi-filter Toolbar */}
      <ShuttleToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Enterprise Data Table & Cards */}
      <ShuttleTable
        shuttles={shuttles}
        isLoading={isLoading}
        onSelectShuttle={handleSelectShuttle}
        onEditShuttle={handleOpenEditForm}
        onDeleteShuttle={handleDeleteShuttle}
        onAddShuttle={handleOpenAddForm}
        onResetFilters={handleResetFilters}
      />

      {/* Add / Edit Shuttle Modal Form */}
      <ShuttleForm
        isOpen={isFormOpen}
        shuttleToEdit={shuttleToEdit}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
