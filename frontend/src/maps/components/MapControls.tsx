import React, { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Map as MapIcon,
  Sun,
  Moon,
  Compass,
  Eye,
} from 'lucide-react';
import { MapControlsConfig, MapThemeMode } from '../types/mapTypes';

interface MapControlsProps {
  config?: MapControlsConfig;
  themeMode?: MapThemeMode;
  onToggleTheme?: () => void;
  defaultCenter?: { lat: number; lng: number };
  map?: google.maps.Map | null;
}

export const MapControls: React.FC<MapControlsProps> = ({
  config = {
    showZoom: true,
    showFullscreen: true,
    showMapTypeToggle: true,
    showStreetView: true,
    showThemeToggle: true,
    showRecenter: true,
    position: 'top-right',
  },
  themeMode = 'dark',
  onToggleTheme,
  defaultCenter = { lat: 37.7749, lng: -122.4194 },
  map: providedMap,
}) => {
  const contextMap = useMap();
  const map = providedMap ?? contextMap;
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  const handleZoomIn = () => {
    if (!map) return;
    const currentZoom = map.getZoom() || 12;
    map.setZoom(currentZoom + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    const currentZoom = map.getZoom() || 12;
    map.setZoom(currentZoom - 1);
  };

  const handleRecenter = () => {
    if (!map) return;
    map.panTo(defaultCenter);
    map.setZoom(12);
  };

  const handleToggleMapType = () => {
    if (!map) return;
    const nextType = mapTypeId === 'roadmap' ? 'satellite' : mapTypeId === 'satellite' ? 'hybrid' : 'roadmap';
    map.setMapTypeId(nextType);
    setMapTypeId(nextType);
  };

  const handleToggleFullscreen = () => {
    const mapElement = map?.getDiv().parentElement;
    if (!mapElement) return;

    if (!document.fullscreenElement) {
      mapElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleToggleStreetView = () => {
    if (!map) return;
    const streetView = map.getStreetView();
    const isVisible = streetView.getVisible();
    streetView.setVisible(!isVisible);
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} z-20 flex flex-col gap-2 p-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-xl text-white select-none`}
    >
      {config.showZoom && (
        <div className="flex flex-col border-b border-slate-700/60 pb-1.5 mb-0.5 space-y-1">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {config.showRecenter && (
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
        </button>
      )}

      {config.showMapTypeToggle && (
        <button
          onClick={handleToggleMapType}
          title={`Map Type (${mapTypeId})`}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center relative"
        >
          <MapIcon className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 text-[8px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 rounded-full uppercase">
            {mapTypeId.substring(0, 1)}
          </span>
        </button>
      )}

      {config.showStreetView && (
        <button
          onClick={handleToggleStreetView}
          title="Toggle Street View"
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {config.showThemeToggle && onToggleTheme && (
        <button
          onClick={onToggleTheme}
          title={`Switch Theme (Current: ${themeMode})`}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      )}

      {config.showFullscreen && (
        <button
          onClick={handleToggleFullscreen}
          title="Fullscreen Toggle"
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
