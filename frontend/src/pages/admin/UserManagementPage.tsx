import React, { useMemo, useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent } from '../../components/common/cards/Card';
import { Table, Column } from '../../components/common/tables/Table';
import { Button } from '../../components/common/buttons/Button';
import { BookingDetailItem, Employee, User } from '../../types';
import { Plus, CheckCircle2, Trash2, ChevronDown, ChevronUp, IndianRupee, MapPin, Clock3, BusFront, CalendarDays } from 'lucide-react';
import { useEmployees, useCreateEmployee, useDeleteEmployee } from '../../hooks/useEmployees';
import { EmployeeForm } from '../../components/employees/EmployeeForm';
import { CreateEmployeePayload } from '../../types';
import { useBookings } from '../../hooks/useBookings';
import { useRoutes } from '../../hooks/useRoutes';
import toast from 'react-hot-toast';

const toUser = (employee: Employee): User => ({
  id: employee.id,
  name: employee.name,
  email: employee.email,
  role: 'EMPLOYEE',
  department: employee.department,
  employeeId: employee.employeeId,
  phone: employee.phone,
  status: employee.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
  createdAt: employee.createdAt,
});

export const UserManagementPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [expandedRideIds, setExpandedRideIds] = useState<Record<string, boolean>>({});
  const { employees, isLoading, isFetching, refetch } = useEmployees();
  const { bookings } = useBookings();
  const { allRoutes } = useRoutes();
  const createEmployee = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const users = employees.map(toUser);

  const routeDistanceMap = useMemo(
    () => Object.fromEntries(allRoutes.map((route) => [String(route.id), Number(route.totalDistanceKm ?? 0)])),
    [allRoutes],
  );

  const selectedUser = employees.find((employee) => employee.id === selectedUserId) ?? null;

  const selectedUserBookings = useMemo<BookingDetailItem[]>(() => {
    if (!selectedUser) return [];

    return [...bookings]
      .filter((booking) => String(booking.employeeId) === String(selectedUser.id))
      .sort((a, b) => {
        const dateA = new Date(a.travelDate || a.bookingDate || 0).getTime();
        const dateB = new Date(b.travelDate || b.bookingDate || 0).getTime();
        return dateB - dateA;
      });
  }, [bookings, selectedUser]);

  const totalRideCost = selectedUserBookings.reduce((sum, booking) => {
    const routeDistanceKm = Number(routeDistanceMap[String(booking.routeId)] ?? 0);
    return sum + routeDistanceKm * 7;
  }, 0);

  const toggleRide = (rideId: string) => {
    setExpandedRideIds((prev) => ({
      ...prev,
      [rideId]: !prev[rideId],
    }));
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Employee Name & Email',
      render: (user) => <div><p className="font-extrabold text-slate-900 dark:text-white">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>,
    },
    {
      key: 'employeeId',
      header: 'ID / Dept',
      render: (user) => <div><p className="font-mono text-xs font-bold text-indigo-600">{user.employeeId}</p><p className="text-xs text-slate-500">{user.department}</p></div>,
    },
    {
      key: 'role',
      header: 'Access Role',
      render: (user) => <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">{user.role}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> {user.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user) => <span className="text-xs text-slate-500 font-mono">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <button
          type="button"
          title="Delete employee"
          disabled={deleteEmployee.isPending}
          onClick={async () => {
            if (!window.confirm(`Delete employee ${user.name}? This action cannot be undone.`)) return;
            try {
              await deleteEmployee.mutateAsync(user.id);
              await refetch();
              toast.success(`${user.name} removed successfully.`);
            } catch (error: any) {
              toast.error(error?.response?.data?.message || 'Failed to delete employee.');
            }
          }}
          className="p-1.5 rounded-md text-rose-500 hover:bg-rose-500/10 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="User & Access Directory"
        subtitle="Manage employee shuttle passes, driver credentials, and administrative permissions."
        actions={<Button variant="primary" size="sm" onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>Add Employee</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
        <Card>
          <CardContent className="p-0">
            <Table
              columns={columns}
              data={users}
              keyExtractor={(user) => user.id}
              isLoading={isLoading}
              onRowClick={(user) => setSelectedUserId(user.id)}
              emptyMessage={isFetching ? 'Loading employees...' : 'No employees found.'}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            {selectedUser ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Selected employee</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-right text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <IndianRupee className="w-3 h-3" />
                      Total cost
                    </div>
                    <div className="mt-1 text-lg font-extrabold">₹{totalRideCost.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Ride history</p>
                    <span className="text-xs font-semibold text-slate-500">{selectedUserBookings.length} trips</span>
                  </div>

                  {selectedUserBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                      No shuttle rides found for this employee.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                      {selectedUserBookings.map((booking) => {
                        const routeDistanceKm = Number(routeDistanceMap[String(booking.routeId)] ?? 0);
                        const tripCost = routeDistanceKm * 7;
                        const isExpanded = Boolean(expandedRideIds[booking.id]);

                        return (
                          <div key={booking.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
                            <button
                              type="button"
                              onClick={() => toggleRide(booking.id)}
                              className="flex w-full items-center justify-between gap-3 p-3 text-left"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                  <BusFront className="h-4 w-4 text-indigo-500" />
                                  <span className="truncate">{booking.routeName || 'Assigned route'}</span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {booking.travelDate || booking.bookingDate || 'N/A'}</span>
                                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {booking.pickupTime || 'N/A'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{tripCost.toFixed(2)}</span>
                                {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="border-t border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950/40">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pickup</span>
                                    <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                                      {booking.pickupStopName || 'Pickup point'}
                                    </p>
                                  </div>
                                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Drop-off</span>
                                    <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                      {booking.dropStopName || 'Drop-off point'}
                                    </p>
                                  </div>
                                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Distance</span>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{routeDistanceKm.toFixed(1)} km</p>
                                  </div>
                                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Seat</span>
                                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{booking.seatNumber || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                  <span className="font-bold uppercase tracking-[0.18em]">Fare calculation</span>
                                  <span className="font-extrabold">₹{routeDistanceKm.toFixed(1)} × ₹7/km = ₹{tripCost.toFixed(2)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                Select an employee to view their shuttle ride history and cost summary.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (payload: CreateEmployeePayload) => {
          try {
            await createEmployee.mutateAsync(payload);
            await refetch();
            toast.success('Employee added successfully.');
          } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create employee.');
            throw error;
          }
        }}
        isLoading={createEmployee.isPending}
      />
      <button type="button" onClick={() => refetch()} className="text-xs text-slate-500 hover:text-indigo-600">Refresh employee directory</button>
    </div>
  );
};
