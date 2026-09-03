import React, { useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent } from '../../components/common/cards/Card';
import { Button } from '../../components/common/buttons/Button';
import { Input } from '../../components/common/inputs/Input';
import { Driver, CreateDriverPayload, ShuttleDetailItem } from '../../types';
import { useDrivers, useCreateDriver, useUpdateDriverAssignment, useDeleteDriver } from '../../hooks/useDrivers';
import { useShuttles } from '../../hooks/useShuttles';
import { Plus, Pencil, Trash2, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { driverService } from '../../services/driverService';

const emptyDriver: CreateDriverPayload = {
  driverId: '', firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', password: '', confirmPassword: '',
  licenseExpiry: '', experienceYears: 0, status: 'ACTIVE', availability: 'OFF_DUTY',
};

export const DriverManagementPage: React.FC = () => {
  const { drivers, isLoading, refetch } = useDrivers();
  const { allShuttles } = useShuttles();
  const createDriver = useCreateDriver();
  const assignShuttle = useUpdateDriverAssignment();
  const deleteDriver = useDeleteDriver();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<CreateDriverPayload>(emptyDriver);

  const openCreate = () => { setEditing(null); setForm({ ...emptyDriver }); setIsOpen(true); };
  const openEdit = (driver: Driver) => {
    setEditing(driver);
    setForm({ driverId: driver.driverId, firstName: driver.firstName, lastName: driver.lastName, email: driver.email, phone: driver.phone, licenseNumber: driver.licenseNumber, licenseExpiry: driver.licenseExpiry, experienceYears: driver.experienceYears, status: driver.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE', availability: 'OFF_DUTY', password: '', confirmPassword: '' });
    setIsOpen(true);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const phoneDigits = form.phone.replace(/\D/g, '');
    const phone = phoneDigits.length === 11 && phoneDigits.startsWith('1') ? phoneDigits.slice(1) : phoneDigits;
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must contain 10 digits.');
      return;
    }
    if (!form.licenseExpiry || new Date(`${form.licenseExpiry}T00:00:00`) <= new Date()) {
      toast.error('License expiry must be a future date.');
      return;
    }
    if (!editing && (!form.password || form.password.length < 8 || form.password !== form.confirmPassword)) {
      toast.error('Enter matching passwords with at least 8 characters.');
      return;
    }
    try {
      if (editing) await driverService.updateDriver(editing.id, form);
      else await createDriver.mutateAsync(form);
      await refetch(); setIsOpen(false); toast.success(editing ? 'Driver updated.' : 'Driver added.');
    } catch (error: any) { toast.error(error?.response?.data?.message || 'Unable to save driver.'); }
  };
  const remove = async (driver: Driver) => {
    if (!window.confirm(`Delete driver ${driver.name}? This action cannot be undone.`)) return;
    try { await deleteDriver.mutateAsync(driver.id); await refetch(); toast.success('Driver removed.'); }
    catch (error: any) { toast.error(error?.response?.data?.message || 'Unable to delete driver.'); }
  };
  const changeShuttle = async (driver: Driver, shuttleId: string) => {
    const shuttle = allShuttles.find((item: ShuttleDetailItem) => item.id === shuttleId);
    try { await assignShuttle.mutateAsync({ id: driver.id, shuttle: shuttle ? { shuttleId: shuttle.id, vehicleNumber: shuttle.vehicleNumber, model: shuttle.model, capacity: shuttle.capacity } : null }); await refetch(); toast.success('Shuttle assignment updated.'); }
    catch (error: any) { toast.error(error?.response?.data?.message || 'Unable to assign shuttle.'); }
  };

  return <div className="space-y-6 animate-in fade-in duration-200">
    <PageHeader title="Driver Management" subtitle="Add, update, assign shuttles, or remove fleet drivers." actions={<Button variant="primary" size="sm" onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>Add Driver</Button>} />
    <Card><CardContent className="p-0 overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500"><tr><th className="p-4">Driver</th><th className="p-4">License</th><th className="p-4">Experience</th><th className="p-4">Shuttle</th><th className="p-4">Joined</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{isLoading ? <tr><td colSpan={6} className="p-6 text-sm text-slate-500">Loading drivers...</td></tr> : drivers.map((driver: Driver) => <tr key={driver.id} className="text-xs"><td className="p-4"><div className="flex items-center gap-2"><UserRound className="w-4 h-4 text-indigo-500" /><div><strong className="text-slate-900 dark:text-white">{driver.name}</strong><span className="block text-slate-500">{driver.email} · {driver.driverId}</span></div></div></td><td className="p-4"><span className="font-mono">{driver.licenseNumber}</span><span className="block text-slate-500">Expires {driver.licenseExpiry}</span></td><td className="p-4">{driver.experienceYears} years</td><td className="p-4"><select value={driver.assignedShuttle?.shuttleId || ''} onChange={(event) => changeShuttle(driver, event.target.value)} className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"><option value="">Unassigned</option>{allShuttles.map((shuttle: ShuttleDetailItem) => <option key={shuttle.id} value={shuttle.id}>{shuttle.vehicleNumber}</option>)}</select></td><td className="p-4 text-slate-500">{driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : '-'}</td><td className="p-4 text-right"><button type="button" title="Edit driver" onClick={() => openEdit(driver)} className="p-1.5 text-indigo-500"><Pencil className="w-4 h-4" /></button><button type="button" title="Delete driver" onClick={() => remove(driver)} className="p-1.5 text-rose-500"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table></CardContent></Card>
    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"><Card className="w-full max-w-2xl"><CardContent className="p-5"><div className="flex justify-between mb-4"><h2 className="font-bold">{editing ? 'Update Driver' : 'Add Driver'}</h2><button type="button" onClick={() => setIsOpen(false)}>✕</button></div><form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Driver ID" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} required /><Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /><Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /><Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /><Input label="License Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} required /><Input label="License Expiry" type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} required />{!editing && <><Input label="Password" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><Input label="Confirm Password" type="password" value={form.confirmPassword || ''} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></>}<Input label="Experience (years)" type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} required /><div className="sm:col-span-2 flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="submit" variant="primary" isLoading={createDriver.isPending}>Save Driver</Button></div></form></CardContent></Card></div>}
  </div>;
};
