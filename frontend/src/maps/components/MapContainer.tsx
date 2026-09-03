import React from 'react';
import { GoogleMapsProvider } from '../providers/GoogleMapsProvider';
import { GoogleMap } from './GoogleMap';
import { GoogleMapProps } from '../types/mapTypes';

interface MapContainerProps extends GoogleMapProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  title,
  subtitle,
  headerAction,
  className = 'h-[450px]',
  ...mapProps
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between pb-1 px-1">
          <div>
            {title && (
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <GoogleMapsProvider defaultTheme={mapProps.theme || 'dark'}>
        <GoogleMap className={className} {...mapProps} />
      </GoogleMapsProvider>
    </div>
  );
};
