import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarPlus, Clock, Route as RouteIcon, Bus, UserRound } from 'lucide-react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/cards/Card';
import { Button } from '../../components/common/buttons/Button';
import { useShuttles } from '../../hooks/useShuttles';
import { useCreateSchedule, useSchedules } from '../../hooks/useSchedules';
import { CreateSchedulePayload } from '../../types';

const today = new Date().toISOString().slice(0, 10);

export const ScheduleManagementPage: React.FC = () => {
  const { allShuttles, isLoading: isShuttlesLoading, isError: isShuttlesError } = useShuttles();
  const { allSchedules, isLoading, isError } = useSchedules();
  const createSchedule = useCreateSchedule();
  const [form, setForm] = useState<CreateSchedulePayload>({
    routeId: '', shuttleId: '', driverId: '', startDate: today, endDate: today,
    departureTime: '08:00', arrivalTime: '09:00', durationMinutes: 60, bufferTimeMinutes: 0, operatingDays: ['MON'],
  });

  const selectedShuttle = allShuttles.find((shuttle) => shuttle.id === form.shuttleId);
  const update = <K extends keyof CreateSchedulePayload>(key: K, value: CreateSchedulePayload[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.routeId || !form.shuttleId || !form.driverId || !form.startDate || !form.endDate) {
      toast.error('Select a shuttle with an assigned route and driver, plus a date range.');
      return;
    }
    if (form.arrivalTime <= form.departureTime) {
      toast.error('Arrival time must be after source arrival time.');
      return;
    }
    try {
      await createSchedule.mutateAsync(form);
      toast.success('Schedule assigned successfully.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Schedule overlaps an existing driver or shuttle schedule.');
    }
  };

  return <div className="space-y-6 pb-12">
    <PageHeader title="Schedule Assignment" subtitle="Add non-overlapping operating times to shuttles configured in Shuttle Management." />
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarPlus className="w-4 h-4" /> New schedule</CardTitle></CardHeader><CardContent>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select label="Configured shuttle" icon={<Bus />} value={form.shuttleId} onChange={(value) => {
          const shuttle = allShuttles.find((item) => item.id === value);
          update('shuttleId', value);
          update('routeId', shuttle?.assignedRoute?.id || '');
          update('driverId', shuttle?.assignedDriver?.id || '');
        }} disabled={isShuttlesLoading || isShuttlesError} options={allShuttles.filter((shuttle) => shuttle.status !== 'MAINTENANCE').map((shuttle) => ({ value: shuttle.id, label: shuttle.vehicleNumber }))} />
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-sm"><div className="flex items-center gap-2 text-xs text-slate-500"><RouteIcon className="w-3.5 h-3.5" /> Existing assignment</div><p className="mt-1 font-semibold">{selectedShuttle?.assignedRoute?.name || 'Select a configured shuttle'}</p><p className="text-xs text-slate-500"><UserRound className="mr-1 inline w-3.5 h-3.5" />{selectedShuttle?.assignedDriver?.name || 'Driver assigned in Shuttle Management'}</p></div>
        <Field label="Start date" type="date" value={form.startDate || ''} onChange={(value) => update('startDate', value)} />
        <Field label="End date" type="date" value={form.endDate || ''} onChange={(value) => update('endDate', value)} />
        <Field label="Source arrival / departure" type="time" value={form.departureTime} onChange={(value) => update('departureTime', value)} />
        <Field label="Destination arrival" type="time" value={form.arrivalTime} onChange={(value) => update('arrivalTime', value)} />
        <div className="md:col-span-2 lg:col-span-3 flex justify-end"><Button type="submit" disabled={createSchedule.isPending} leftIcon={<CalendarPlus className="w-4 h-4" />}>{createSchedule.isPending ? 'Assigning...' : 'Assign Schedule'}</Button></div>
      </form>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>Assigned schedules</CardTitle></CardHeader><CardContent>
      {isLoading && <p className="text-sm text-slate-500">Loading schedules...</p>}
      {isError && <p className="text-sm text-red-600">Unable to load schedules.</p>}
      {!isLoading && !isError && <div className="space-y-2">{allSchedules.map((schedule) => <div key={schedule.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-sm"><strong>{schedule.routeName}</strong><span>{schedule.shuttleNumber}</span><span>{schedule.driverName}</span><span>{schedule.startDate || '-'} · {schedule.departureTime}</span><span>{schedule.arrivalTime} · {schedule.status}</span></div>)}</div>}
    </CardContent></Card>
  </div>;
};

const Select: React.FC<{ label: string; icon: React.ReactNode; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean }> = ({ label, icon, value, onChange, options, disabled = false }) => <label className="text-xs font-semibold text-slate-700 dark:text-slate-300"><span className="mb-1 flex items-center gap-1.5">{icon}{label}</span><select required disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm"><option value="">{disabled ? 'Unable to load shuttles' : options.length ? `Select ${label.toLowerCase()}` : 'No shuttles configured'}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
const Field: React.FC<{ label: string; type: string; value: string; onChange: (value: string) => void }> = ({ label, type, value, onChange }) => <label className="text-xs font-semibold text-slate-700 dark:text-slate-300"><span className="mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm" /></label>;
