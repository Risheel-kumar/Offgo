import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/cards/Card';
import { Input } from '../../components/common/inputs/Input';
import { Switch } from '../../components/common/inputs/Switch';
import { Button } from '../../components/common/buttons/Button';
import { Save, Bell, Shield, Sliders } from 'lucide-react';
import { storage } from '../../utils/storage';
import toast from 'react-hot-toast';

const SETTINGS_KEY = 'offgo_system_settings';
const DEFAULT_WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3000/ws';

export const SettingsPage: React.FC = () => {
  const [geofenceRadius, setGeofenceRadius] = useState(() => storage.get<string>(`${SETTINGS_KEY}_radius`, '500'));
  const [stompSocketUrl, setStompSocketUrl] = useState(() => storage.get<string>(`${SETTINGS_KEY}_ws`, DEFAULT_WS_URL));
  const [autoRebalance, setAutoRebalance] = useState(() => storage.get<boolean>(`${SETTINGS_KEY}_rebalance`, true));
  const [emailAlerts, setEmailAlerts] = useState(() => storage.get<boolean>(`${SETTINGS_KEY}_alerts`, true));

  const handleSave = () => {
    storage.set(`${SETTINGS_KEY}_radius`, geofenceRadius);
    storage.set(`${SETTINGS_KEY}_ws`, stompSocketUrl);
    storage.set(`${SETTINGS_KEY}_rebalance`, autoRebalance);
    storage.set(`${SETTINGS_KEY}_alerts`, emailAlerts);
    toast.success('System configuration parameters updated and saved');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <PageHeader
        title="System Settings"
        subtitle="Configure backend REST endpoint, STOMP WebSocket broker, geofence radius, and automated dispatch rules."
        actions={
          <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" /> Telematics & Telemetry Broker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="WebSocket STOMP Broker URL"
            value={stompSocketUrl}
            onChange={(e) => setStompSocketUrl(e.target.value)}
          />
          <Input
            label="Geofence Deviation Threshold (Meters)"
            type="number"
            value={geofenceRadius}
            onChange={(e) => setGeofenceRadius(e.target.value)}
            helperText="Triggers instant alert to fleet dispatch if vehicle strays outside buffer"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" /> Automated Fleet Dispatch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Switch
            checked={autoRebalance}
            onChange={setAutoRebalance}
            label="Enable AI Capacity Auto-Rebalancing"
            description="Automatically re-assigns reserve shuttles when passenger waitlists exceed 15 persons"
          />
          <Switch
            checked={emailAlerts}
            onChange={setEmailAlerts}
            label="Dispatch Delay Push Notifications"
            description="Sends SMS / Email to checked-in employees when shuttle is delayed > 10 minutes"
          />
        </CardContent>
      </Card>
    </div>
  );
};
