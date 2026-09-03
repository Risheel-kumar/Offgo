import React, { useEffect, useState } from 'react';
import { GoogleMap, GoogleMapsProvider, CustomMarkerData } from '../../maps';
import { useMap } from '@vis.gl/react-google-maps';
import { useQuery } from '@tanstack/react-query';
import { LiveTrackingVehicle } from '../../types';
import { routeService } from '../../services/routeService';
import { routeStopService } from '../../services/routeStopService';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ExternalLink,
  Layers,
  MapPin,
  Navigation,
  Gauge,
  User,
  Radio,
  Sun,
  Moon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ActiveRouteDirections: React.FC<{ vehicle: LiveTrackingVehicle; route: any; stops: any[] }> = ({ vehicle, route, stops }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps || vehicle.status !== 'ACTIVE' || !vehicle.trackingEnabled || !route) return;
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: false,
      polylineOptions: { strokeColor: '#10b981', strokeOpacity: 0.9, strokeWeight: 5 },
    });
    const waypoints = stops
      .filter((stop) => stop.address || (stop.lat !== 0 || stop.lng !== 0))
      .map((stop) => ({ location: stop.address || { lat: stop.lat, lng: stop.lng }, stopover: true }));

    new google.maps.DirectionsService().route({
      origin: route.startPoint.address || route.startPoint.name,
      destination: route.destination.address || route.destination.name,
      waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) renderer.setDirections(result);
    });

    return () => renderer.setMap(null);
  }, [map, route, stops, vehicle.status]);

  return null;
};

interface FleetMapProps {
  vehicle?: LiveTrackingVehicle | null;
  vehicles?: LiveTrackingVehicle[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string) => void;
  className?: string;
  onRefresh?: () => void;
}

export const FleetMap: React.FC<FleetMapProps> = ({
  vehicle,
  vehicles = [],
  selectedVehicleId,
  onSelectVehicle,
  className = 'h-[480px] w-full',
  onRefresh,
}) => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showTraffic, setShowTraffic] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');

  // Determine active vehicle to highlight / center
  const displayVehicles = vehicles.length > 0 ? vehicles : vehicle ? [vehicle] : [];
  const activeVehicle =
    displayVehicles.find((v) => v.id === selectedVehicleId || v.id === vehicle?.id) ||
    displayVehicles[0];

  const { data: activeRoute } = useQuery({
    queryKey: ['fleet-route', activeVehicle?.routeId],
    queryFn: () => routeService.getRouteById(activeVehicle!.routeId!),
    enabled: Boolean(activeVehicle?.routeId && activeVehicle.status === 'ACTIVE'),
  });
  const { data: activeRouteStops = [] } = useQuery({
    queryKey: ['fleet-route-stops', activeVehicle?.routeId],
    queryFn: () => routeStopService.getRouteStops(activeVehicle!.routeId!),
    enabled: Boolean(activeVehicle?.routeId && activeVehicle.status === 'ACTIVE'),
  });

  const mapCenter = activeVehicle?.currentLocation
    ? { lat: activeVehicle.currentLocation.lat, lng: activeVehicle.currentLocation.lng }
    : { lat: 12.9716, lng: 77.5946 };

  // Convert vehicles into Map Markers
  const markers: CustomMarkerData[] = displayVehicles.map((v) => {
    const isSelected = v.id === activeVehicle?.id;
    let statusType: 'active' | 'idle' | 'delayed' = 'idle';
    if (v.status === 'IN_TRANSIT' || v.status === 'ON_TIME') statusType = 'active';
    else if (v.status === 'DELAYED') statusType = 'delayed';

    return {
      id: v.id,
      position: {
        lat: v.currentLocation.lat,
        lng: v.currentLocation.lng,
      },
      title: `${v.vehicleNumber} • ${v.routeName}`,
      subtitle: `Driver: ${v.driverName} | Speed: ${v.speedKmH} km/h | Next: ${v.nextStop}`,
      iconType: 'shuttle',
      status: statusType,
      badgeText: v.vehicleNumber,
      heading: v.heading,
      color: isSelected ? '#6366f1' : undefined,
    };
  });

  // Polyline overlay for active vehicle route path
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 1, 18));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 1, 10));

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
    toast.success(showTraffic ? 'Traffic layer hidden' : 'Google Maps Traffic layer active');
  };

  const handleToggleTheme = () => {
    const nextTheme = mapTheme === 'dark' ? 'light' : 'dark';
    setMapTheme(nextTheme);
    toast.success(`Switched map style to ${nextTheme} mode`);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRefreshData = () => {
    if (onRefresh) onRefresh();
    toast.success('Live GPS telematics stream synced');
  };

  const handleMarkerSelect = (marker: CustomMarkerData | null) => {
    if (marker && onSelectVehicle) {
      onSelectVehicle(marker.id);
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : className
      }`}
    >
      <GoogleMapsProvider defaultTheme={mapTheme}>
        <GoogleMap
          center={mapCenter}
          zoom={zoomLevel}
          theme={mapTheme}
          markers={markers}
          polylines={[]}
          selectedMarkerId={activeVehicle?.id}
          onMarkerSelect={handleMarkerSelect}
          className="h-full w-full"
        >
          {activeVehicle?.status === 'ACTIVE' && activeVehicle.trackingEnabled && activeRoute && <ActiveRouteDirections vehicle={activeVehicle} route={activeRoute} stops={activeRouteStops} />}
        </GoogleMap>
      </GoogleMapsProvider>

      {/* Top Left Live Stream Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Telematics Sync</span>
        </div>
        {activeVehicle && (
          <div className="px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md border border-emerald-400/60 text-white text-xs font-bold shadow-lg">
            Stop: {activeVehicle.nextStop || activeVehicle.routeName || 'No active stop'}
          </div>
        )}
        {displayVehicles.length > 1 && (
          <div className="px-3 py-1.5 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold font-mono shadow-lg">
            {displayVehicles.length} Shuttles Active
          </div>
        )}
      </div>

      {/* Top Right Embedded Map Action Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggleTraffic}
          className={`p-2.5 rounded-2xl border shadow-lg hover:scale-105 transition-all cursor-pointer ${
            showTraffic
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700/80'
          }`}
          title="Toggle Traffic Layer"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggleTheme}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Toggle Dark/Light Map"
        >
          {mapTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
        <button
          onClick={handleRefreshData}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Sync Telematics Stream"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggleFullscreen}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
          title="Fullscreen Canvas"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Active Vehicle Telematics Banner */}
      {activeVehicle && (
        <div className="absolute bottom-4 left-4 right-4 z-10 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xl text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-white">
                  {activeVehicle.vehicleNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeVehicle.routeName}
                </span>
              </div>
              <p className="text-slate-300 font-medium flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{activeVehicle.currentLocation.address}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">SPEED</span>
                <span className="font-mono font-bold text-white">{activeVehicle.speedKmH} km/h</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">DRIVER</span>
                <span className="font-bold text-white truncate max-w-[90px]">{activeVehicle.driverName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

