import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle2, Clock, Navigation, Users } from 'lucide-react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/cards/Card';
import { Button } from '../../components/common/buttons/Button';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/axios';
import { getCurrentScheduleFromList, getScheduleState, scheduleService } from '../../services/scheduleService';
import { useShuttles } from '../../hooks/useShuttles';
import { useDrivers } from '../../hooks/useDrivers';

interface DriverDashboardData {
  driverName: string;
  shuttleNumber?: string;
  routeName?: string;
  completedTrips: number;
  todaysPassengers: number;
}

const unwrap = <T,>(response: { data: { data?: T } | T }) =>
  (response.data as { data?: T }).data ?? response.data as T;

export const DriverDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { allDrivers, isLoading: isDriversLoading } = useDrivers();
  const driver = allDrivers.find((item) => item.email.toLowerCase() === user?.email?.toLowerCase());
  const driverId = driver?.id;
  const dashboard = useQuery({
    queryKey: ['driver-dashboard', driverId],
    queryFn: async () => unwrap<DriverDashboardData>(await apiClient.get(`/dashboard/driver/${driverId}`)),
    enabled: Boolean(driverId),
  });
  const schedules = useQuery({
    queryKey: ['driver-dashboard-schedules', driverId],
    queryFn: () => scheduleService.getSchedules({ driverFilter: driverId }),
    enabled: Boolean(driverId),
  });
  const shuttles = useShuttles();
  const assignedSchedules = (schedules.data || []).filter((schedule) => schedule.driverId === driverId);
  const activeSchedules = assignedSchedules.filter((schedule) => getScheduleState(schedule) === 'ACTIVE');
  const currentSchedule = getCurrentScheduleFromList(assignedSchedules) || assignedSchedules[0] || null;
  const assignedShuttle = shuttles.allShuttles.find((shuttle) => shuttle.assignedDriver?.id === driverId);

  const handleOpenNavigation = () => {
    if (activeSchedules.length > 1) {
      window.alert('Only one active assigned schedule can run at a time. Please complete or end the current active schedule before starting another.');
      return;
    }

    navigate('/driver/navigation');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader title="Driver Shift Console" subtitle="Your assigned schedules, passenger workload, and shift actions." actions={<Button leftIcon={<Navigation className="w-4 h-4" />} onClick={handleOpenNavigation}>Open Navigation</Button>} />
      {(dashboard.isLoading || isDriversLoading) && <Card><CardContent className="p-6 text-sm text-slate-500">Loading driver dashboard...</CardContent></Card>}
      {!isDriversLoading && !driverId && <Card><CardContent className="p-6 text-sm text-red-600">No driver profile matches the logged-in account.</CardContent></Card>}
      {dashboard.isError && <Card><CardContent className="p-6 text-sm text-red-600">Unable to load driver dashboard.</CardContent></Card>}
      {dashboard.data && <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric icon={<Users />} label="Today's passengers" value={dashboard.data.todaysPassengers} />
        <Metric icon={<CheckCircle2 />} label="Completed trips" value={dashboard.data.completedTrips} />
        <Metric icon={<Navigation />} label="Assigned shuttle" value={assignedShuttle?.vehicleNumber || dashboard.data.shuttleNumber || 'Unassigned'} />
        <Metric icon={<Clock />} label="Current route" value={currentSchedule?.routeName || assignedShuttle?.assignedRoute?.name || dashboard.data.routeName || 'No route assigned'} />
      </div>}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Assigned schedules</CardTitle></CardHeader>
        <CardContent>
          {schedules.isLoading && <p className="text-sm text-slate-500">Loading schedules...</p>}
          {schedules.isError && <p className="text-sm text-red-600">Unable to load schedules.</p>}
          {!schedules.isLoading && !schedules.isError && assignedSchedules.length === 0 && <p className="text-sm text-slate-500">No schedules are assigned to your driver account.</p>}
          <div className="space-y-3">{assignedSchedules.map((schedule) => {
            const state = getScheduleState(schedule);
            const statusClasses = {
              ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
              UPCOMING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
              COMPLETED: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            }[state];

            return (
              <div key={schedule.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{schedule.routeName}</p>
                  <p className="text-xs text-slate-500">{schedule.departureTime} - {schedule.arrivalTime} · {schedule.shuttleNumber}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`}>{state}</span>
              </div>
            );
          })}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="w-4 h-4" /> Current assignment</CardTitle></CardHeader>
        <CardContent>
          {shuttles.isLoading && <p className="text-sm text-slate-500">Loading assignment...</p>}
          {!shuttles.isLoading && !assignedShuttle && <p className="text-sm text-slate-500">No shuttle is assigned to your driver account.</p>}
          {assignedShuttle && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"><div><span className="block text-xs text-slate-500">Shuttle</span><strong>{assignedShuttle.vehicleNumber}</strong></div><div><span className="block text-xs text-slate-500">Route</span><strong>{currentSchedule?.routeName || assignedShuttle.assignedRoute?.name || 'No route assigned'}</strong></div></div>}
        </CardContent>
      </Card>
    </div>
  );
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-indigo-600">{icon}<span className="text-xs text-slate-500">{label}</span></div><p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{value}</p></CardContent></Card>
);
