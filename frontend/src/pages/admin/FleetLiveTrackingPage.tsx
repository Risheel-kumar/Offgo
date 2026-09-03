import React from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { FleetOperationsDashboard } from '../../components/fleet/FleetOperationsDashboard';

export const FleetLiveTrackingPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Live Fleet Operations & GPS Control"
        subtitle="Real-time telematics dashboard, active shuttle map visualization, driver telemetry, and passenger manifest monitoring."
      />

      <FleetOperationsDashboard />
    </div>
  );
};
