import React, { createContext, useContext, useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { googleMapsService } from '../services/googleMapsService';
import { MapThemeMode } from '../types/mapTypes';

interface GoogleMapsContextType {
  apiKey: string;
  hasValidKey: boolean;
  themeMode: MapThemeMode;
  setThemeMode: (mode: MapThemeMode) => void;
  isLoaded: boolean;
  loadError: string | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  apiKey: '',
  hasValidKey: false,
  themeMode: 'dark',
  setThemeMode: () => {},
  isLoaded: false,
  loadError: null,
});

export const useGoogleMapsContext = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  defaultTheme?: MapThemeMode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
  defaultTheme = 'dark',
}) => {
  const apiKey = googleMapsService.getApiKey();
  const hasValidKey = googleMapsService.hasValidApiKey();
  const [themeMode, setThemeMode] = useState<MapThemeMode>(defaultTheme);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasValidKey) {
      setLoadError('Google Maps API key is missing or invalid.');
    } else {
      setLoadError(null);
    }
  }, [hasValidKey]);

  // Fallback splash screen if API key is not configured
  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold text-white">Google Maps API Key Required</h2>
          <p className="text-sm text-slate-400">
            To view interactive fleet routes, shuttle tracking, and live stops, please provide a valid Google Maps Platform API key.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-left max-w-lg text-xs space-y-2 font-mono text-slate-300">
          <p className="font-sans font-bold text-indigo-400 uppercase text-[10px]">Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Get an API Key at <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-sans">Google Cloud Console</a></li>
            <li>Open <strong className="text-white">Settings</strong> (⚙️ gear icon, top right) → <strong className="text-white">Secrets</strong></li>
            <li>Add key named <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>Save secret — the application will automatically rebuild</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsContext.Provider
      value={{
        apiKey,
        hasValidKey,
        themeMode,
        setThemeMode,
        isLoaded: true,
        loadError,
      }}
    >
      <APIProvider apiKey={apiKey} version="weekly" libraries={['places']}>
        {children}
      </APIProvider>
    </GoogleMapsContext.Provider>
  );
};
