import React, { useState } from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Bus, MapPin, User, ShieldCheck, Navigation, AlertCircle } from 'lucide-react';
import { CustomMarkerData } from '../types/mapTypes';

interface CustomMarkerProps {
  marker: CustomMarkerData;
  isSelected?: boolean;
  onSelect?: (marker: CustomMarkerData | null) => void;
}

const displayText = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const item = value as Record<string, unknown>;
    const label = item.name ?? item.stopName ?? item.address ?? item.code;
    if (typeof label === 'string' || typeof label === 'number') return String(label);
  }
  return fallback;
};

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  marker,
  isSelected = false,
  onSelect,
}) => {
  const [markerRef, markerInstance] = useAdvancedMarkerRef();
  const [isOpen, setIsOpen] = useState(isSelected);

  const renderIcon = () => {
    switch (marker.iconType) {
      case 'shuttle':
      case 'bus':
        return <Bus className="w-4 h-4 text-white" />;
      case 'stop':
      case 'station':
      case 'terminal':
        return <MapPin className="w-4 h-4 text-white" />;
      case 'driver':
        return <ShieldCheck className="w-4 h-4 text-white" />;
      case 'user':
        return <User className="w-4 h-4 text-white" />;
      default:
        return <Navigation className="w-4 h-4 text-white" />;
    }
  };

  const getStatusBgColor = () => {
    switch (marker.status) {
      case 'active':
      case 'in_transit':
        return 'bg-emerald-500 border-emerald-400 text-emerald-100';
      case 'idle':
        return 'bg-indigo-500 border-indigo-400 text-indigo-100';
      case 'delayed':
      case 'alert':
        return 'bg-amber-500 border-amber-400 text-amber-100';
      case 'completed':
        return 'bg-blue-500 border-blue-400 text-blue-100';
      default:
        return 'bg-indigo-600 border-indigo-500 text-white';
    }
  };

  const handleMarkerClick = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    marker.onClick?.();
    if (onSelect) {
      onSelect(nextState ? marker : null);
    }
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={marker.position}
        onClick={handleMarkerClick}
        title={displayText(marker.title, 'Marker')}
      >
        <div className="relative group cursor-pointer transition-transform duration-200 hover:scale-110 z-10">
          {/* Animated Direction Indicator if Heading provided */}
          {marker.heading !== undefined && (
            <div
              className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse"
              style={{ transform: `rotate(${marker.heading}deg)` }}
            />
          )}

          {/* Marker Pill Container */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-lg ${marker.color ? '' : getStatusBgColor()}`}
            style={marker.color ? { backgroundColor: marker.color, borderColor: marker.color } : undefined}
          >
            {renderIcon()}
            {marker.badgeText && (
              <span
                className="inline-block max-w-[9rem] truncate text-[10px] font-extrabold font-mono uppercase tracking-tight"
                title={displayText(marker.badgeText, '')}
              >
                {marker.badgeText}
              </span>
            )}
          </div>
        </div>
      </AdvancedMarker>

      {(isOpen || isSelected) && (
        <InfoWindow
          anchor={markerInstance}
          onCloseClick={() => {
            setIsOpen(false);
            if (onSelect) onSelect(null);
          }}
        >
          <div className="p-1 space-y-1.5 max-w-xs text-slate-900 font-sans">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1">
              <h4 className="font-extrabold text-xs text-slate-900">
                {displayText(marker.title, 'Location Detail')}
              </h4>
              {marker.status && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono bg-indigo-50 text-indigo-700">
                  {marker.status}
                </span>
              )}
            </div>

            {marker.subtitle && (
              <p className="text-[11px] text-slate-600 font-medium">
                {displayText(marker.subtitle, '')}
              </p>
            )}

            <div className="text-[10px] text-slate-400 font-mono pt-0.5">
              Lat: {marker.position.lat.toFixed(4)} | Lng: {marker.position.lng.toFixed(4)}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
