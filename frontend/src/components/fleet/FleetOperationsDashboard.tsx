import React, { useState } from 'react';
import { useFleet } from '../../hooks/useFleet';
import { useUpdateShuttleStatus } from '../../hooks/useShuttles';
import { useSchedules } from '../../hooks/useSchedules';
import { FleetCard } from './FleetCard';
import { FleetDetailsDrawer } from './FleetDetailsDrawer';
import { LiveTrackingVehicle } from '../../types';
import { Card } from '../common/cards/Card';
import { Button } from '../common/buttons/Button';
import {
  Bus,
  Activity,
  PlayCircle,
  PauseCircle,
  Wrench,
  Clock,
  Search,
  RefreshCw,
  Navigation,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const FleetOperationsDashboard: React.FC = () => {
  const { vehicles, metrics, isLoadingVehicles, refetch } = useFleet();
  const updateStatus = useUpdateShuttleStatus();
  const { allSchedules } = useSchedules();
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(vehicles[0]?.id || null);
  const [selectedDrawerVehicle, setSelectedDrawerVehicle] = useState<LiveTrackingVehicle | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<'TELEMATICS' | 'DRIVER' | 'PASSENGERS' | 'HISTORY'>('TELEMATICS');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDrawer = (v: LiveTrackingVehicle, tab: 'TELEMATICS' | 'DRIVER' | 'PASSENGERS' | 'HISTORY') => {
    setSelectedDrawerVehicle(v);
    setDrawerInitialTab(tab);
  };

  const handleStatusChange = async (vehicle: LiveTrackingVehicle, status: 'INACTIVE' | 'MAINTENANCE') => {
    try {
      await updateStatus.mutateAsync({ id: vehicle.shuttleId || vehicle.id, status });
      toast.success(`${vehicle.vehicleNumber} marked ${status.toLowerCase()}.`);
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to update shuttle status.');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.model && v.model.toLowerCase().includes(searchQuery.toLowerCase()));

    const normStatus = (v.status || '').toUpperCase();
    const isRunning = v.isActive !== false && Boolean(v.trackingEnabled) && v.speedKmH > 0;
    const isUnassigned = v.driverName === 'Unassigned' || v.routeName === 'Unassigned';

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && v.isActive !== false && normStatus !== 'MAINTENANCE') ||
      (statusFilter === 'RUNNING' && isRunning) ||
      (statusFilter === 'SCHEDULED' && normStatus === 'SCHEDULED') ||
      (statusFilter === 'MAINTENANCE' && normStatus === 'MAINTENANCE') ||
      (statusFilter === 'INACTIVE' && (v.isActive === false || normStatus === 'INACTIVE' || normStatus === 'IDLE')) ||
      (statusFilter === 'UNASSIGNED' && isUnassigned) ||
      (statusFilter === 'COMPLETED' && normStatus === 'COMPLETED');

    return matchesSearch && matchesStatus;
  });

  const totalVehicles = metrics?.totalVehicles || vehicles.length;
  const runningCount = metrics?.running ?? vehicles.filter((v) => v.isActive !== false && Boolean(v.trackingEnabled) && v.speedKmH > 0).length;
  const scheduledCount = vehicles.filter((v) => v.scheduleStatus === 'ACTIVE' || v.scheduleStatus === 'SCHEDULED').length;
  const maintenanceCount =
    metrics?.maintenance || vehicles.filter((v) => (v.status || '').toUpperCase() === 'MAINTENANCE').length;
  const inactiveCount =
    metrics?.idle ??
    vehicles.filter((v) => {
      const s = (v.status || '').toUpperCase();
      return s === 'IDLE' || s === 'INACTIVE' || s === 'DRIVER_ON_LEAVE';
    }).length;

  return (
    <div className="space-y-6">
      {/* Executive Fleet Operations Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">TOTAL FLEET</span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">{totalVehicles}</h4>
            <p className="text-[11px] text-slate-500">Registered shuttles</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Bus className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">RUNNING / ACTIVE</span>
            <h4 className="text-2xl font-black text-emerald-500 font-mono mt-0.5">{runningCount}</h4>
            <p className="text-[11px] text-slate-500">In transit & route live</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <PlayCircle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">SCHEDULED SHIFTS</span>
            <h4 className="text-2xl font-black text-indigo-500 font-mono mt-0.5">{scheduledCount}</h4>
            <p className="text-[11px] text-slate-500">Upcoming departures</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">IN MAINTENANCE</span>
            <h4 className="text-2xl font-black text-rose-500 font-mono mt-0.5">{maintenanceCount}</h4>
            <p className="text-[11px] text-slate-500">Garage servicing</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Wrench className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">INACTIVE / DEPOT</span>
            <h4 className="text-2xl font-black text-slate-500 font-mono mt-0.5">{inactiveCount}</h4>
            <p className="text-[11px] text-slate-500">Standby depot</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <PauseCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Operations Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2.5 w-full md:w-auto bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search shuttle number, driver, route, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-full md:w-72"
          />
        </div>

          <div className="flex items-start gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold overflow-x-auto max-w-full">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({vehicles.length})
            </button>
            <button
              onClick={() => setStatusFilter('RUNNING')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'RUNNING'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Running ({runningCount})
            </button>
            <button
              onClick={() => setStatusFilter('SCHEDULED')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'SCHEDULED'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Scheduled ({scheduledCount})
            </button>
            <button
              onClick={() => setStatusFilter('MAINTENANCE')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'MAINTENANCE'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Maintenance ({maintenanceCount})
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'INACTIVE'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Inactive
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${statusFilter === 'ACTIVE' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Active ({vehicles.filter((v) => v.isActive !== false && v.status !== 'MAINTENANCE').length})
            </button>
            <button
              onClick={() => setStatusFilter('UNASSIGNED')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${statusFilter === 'UNASSIGNED' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Unassigned ({vehicles.filter((v) => v.driverName === 'Unassigned' || v.routeName === 'Unassigned').length})
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetch();
              toast.success('Live fleet telematics stream synced');
            }}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Sync Telematics
          </Button>
        </div>
      </div>

      {/* Main Expandable Fleet Accordion List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-500" />
            <span>Fleet Operations Accordion ({filteredVehicles.length} Shuttles)</span>
          </h3>

          <span className="text-[11px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Click any shuttle to inspect live tracking or status</span>
          </span>
        </div>

        {filteredVehicles.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 space-y-3 bg-white dark:bg-slate-900">
            <Bus className="w-10 h-10 mx-auto text-slate-500 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No shuttle vehicles found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or status filter criteria.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVehicles.map((v) => (
              <FleetCard
                key={v.id}
                vehicle={v}
                allVehicles={vehicles}
                isExpanded={expandedVehicleId === v.id}
                onToggleExpand={() =>
                  setExpandedVehicleId(expandedVehicleId === v.id ? null : v.id)
                }
                onViewDriver={() => handleOpenDrawer(v, 'DRIVER')}
                onViewPassengers={() => handleOpenDrawer(v, 'PASSENGERS')}
                onRefresh={refetch}
                onStatusChange={(status) => handleStatusChange(v, status)}
                isStatusUpdating={updateStatus.isPending && updateStatus.variables?.id === (v.shuttleId || v.id)}
                assignedSchedules={allSchedules.filter((schedule) => schedule.shuttleId === (v.shuttleId || v.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fleet Details Drawer */}
      <FleetDetailsDrawer
        isOpen={Boolean(selectedDrawerVehicle)}
        onClose={() => setSelectedDrawerVehicle(null)}
        vehicle={selectedDrawerVehicle}
        initialTab={drawerInitialTab}
      />
    </div>
  );
};
