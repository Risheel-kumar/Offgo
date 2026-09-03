import React from 'react';
import { LiveTrackingVehicle } from '../../types';
import { FleetMap } from './FleetMap';
import { TripProgressTimeline } from './TripProgressTimeline';
import {
  Navigation,
  Gauge,
  Compass,
  MapPin,
  Clock,
  Route,
  Activity,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Users,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface FleetTrackingPanelProps {
  vehicle: LiveTrackingVehicle;
  allVehicles?: LiveTrackingVehicle[];
  onSelectVehicle?: (id: string) => void;
  onRefresh?: () => void;
}

export const FleetTrackingPanel: React.FC<FleetTrackingPanelProps> = ({
  vehicle,
  allVehicles = [],
  onSelectVehicle,
  onRefresh,
}) => {
  const navigate = useNavigate();

  const handleCallDriver = () => {
    if (!vehicle.driverPhone) {
      toast.error('No phone number is available for this driver.');
      return;
    }
    window.location.href = `tel:${vehicle.driverPhone}`;
  };

  return (
    <div className="space-y-4 text-white">
      {/* Top Telematics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Live Telematics Control Center</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {vehicle.trackingEnabled ? 'GPS ACTIVE' : 'GPS INACTIVE'}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              {vehicle.vehicleNumber} • Driver: {vehicle.driverName || 'Unassigned'} • Route: {vehicle.routeName || 'Unassigned'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCallDriver}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Call Driver</span>
          </button>

          <button
            onClick={() => navigate('/admin/live-tracking')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span>Full Tracking</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Embedded Large Google Map Canvas */}
      <FleetMap
        vehicle={vehicle}
        vehicles={allVehicles.length > 0 ? allVehicles : [vehicle]}
        selectedVehicleId={vehicle.id}
        onSelectVehicle={onSelectVehicle}
        onRefresh={onRefresh}
        className="h-[420px] w-full"
      />

      {/* Live Telematics Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">CURRENT SPEED</span>
          <span className="font-mono font-black text-indigo-400 text-sm flex items-center gap-1.5 mt-0.5">
            <Gauge className="w-4 h-4" /> {vehicle.speedKmH} km/h
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">GPS COORDINATES</span>
          <span className="font-mono font-bold text-slate-200 text-xs block mt-0.5">
            {vehicle.currentLocation.lat.toFixed(4)}° N, {vehicle.currentLocation.lng.toFixed(4)}° E
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">HEADING & BEARING</span>
          <span className="font-mono font-bold text-amber-400 text-xs flex items-center gap-1 mt-0.5">
            <Compass className="w-4 h-4" /> {vehicle.heading}° Direction
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">DESTINATION ETA</span>
          <span className="font-mono font-black text-emerald-400 text-sm flex items-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4" /> {vehicle.arrivalTime || 'No arrival scheduled'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">PASSENGER OCCUPANCY</span>
          <span className="font-bold text-slate-200 text-xs flex items-center gap-1 mt-0.5">
            <Users className="w-4 h-4 text-emerald-400" />
            {vehicle.occupancyCount ?? 0} / {vehicle.maxCapacity ?? 0} Boarded
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">VEHICLE HEALTH</span>
          <span className="font-bold text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4" /> {vehicle.lastUpdated || 'No telemetry'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 col-span-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">CURRENT GEOPOSITION</span>
          <span className="font-semibold text-slate-200 text-xs truncate block mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{vehicle.currentLocation.address}</span>
          </span>
        </div>
      </div>

      {/* Trip Progress Timeline Component */}
      <TripProgressTimeline vehicle={vehicle} />
    </div>
  );
};
