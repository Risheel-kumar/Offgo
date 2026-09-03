import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shuttle } from '../../../types';
import { StatusChip } from '../tables/StatusChip';
import { Bus, MapPin, Gauge, Users } from 'lucide-react';

// Fix Leaflet marker icon paths for React/Vite bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom shuttle icon SVG
const shuttleIconSvg = `
  <div class="relative flex items-center justify-center w-9 h-9 bg-indigo-600 text-white rounded-2xl shadow-lg ring-4 ring-indigo-500/30 transform hover:scale-110 transition-transform">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 6v6"/>
      <path d="M16 6v6"/>
      <path d="M2 12h20"/>
      <path d="M18 18h2"/>
      <path d="M4 18h2"/>
      <rect width="20" height="14" x="2" y="4" rx="2"/>
    </svg>
    <span class="absolute -top-1 -right-1 flex h-3 w-3">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
    </span>
  </div>
`;

const createShuttleIcon = () =>
  L.divIcon({
    html: shuttleIconSvg,
    className: 'custom-shuttle-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

export interface LiveShuttleMapProps {
  shuttles: Shuttle[];
  selectedShuttleId?: string;
  onSelectShuttle?: (shuttle: Shuttle) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const LiveShuttleMap: React.FC<LiveShuttleMapProps> = ({
  shuttles,
  selectedShuttleId,
  onSelectShuttle,
  center = [12.9716, 77.5946], // Default Bengaluru tech corridor coordinates
  zoom = 13,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm',
}) => {
  const [activeCenter, setActiveCenter] = useState<[number, number]>(center);

  useEffect(() => {
    if (selectedShuttleId) {
      const selected = shuttles.find((s) => s.id === selectedShuttleId);
      if (selected) {
        setActiveCenter([selected.currentLocation.lat, selected.currentLocation.lng]);
      }
    }
  }, [selectedShuttleId, shuttles]);

  // Sample route path line connecting tech parks
  const samplePolyline: [number, number][] = [
    [12.9716, 77.5946],
    [12.965, 77.608],
    [12.955, 77.625],
    [12.935, 77.65],
    [12.927, 77.685],
  ];

  return (
    <div className={className}>
      <MapContainer
        center={activeCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activeCenter} />

        <Polyline
          positions={samplePolyline}
          pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
        />

        {shuttles.map((shuttle) => (
          <Marker
            key={shuttle.id}
            position={[shuttle.currentLocation.lat, shuttle.currentLocation.lng]}
            icon={createShuttleIcon()}
            eventHandlers={{
              click: () => onSelectShuttle && onSelectShuttle(shuttle),
            }}
          >
            <Popup className="custom-map-popup">
              <div className="p-1 space-y-2 max-w-xs font-sans">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span>{shuttle.vehicleNumber}</span>
                  </div>
                  <StatusChip status={shuttle.status} type="shuttle" />
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  Route: <span className="text-indigo-600">{shuttle.routeName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1 bg-slate-50 rounded-xl p-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {shuttle.occupancy}/{shuttle.capacity} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shuttle.speedKmH} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next: {shuttle.nextStop} ({shuttle.etaNextStopMinutes}m)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Driver: {shuttle.driverName}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
