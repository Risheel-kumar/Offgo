import React, { useState } from 'react';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { LiveSystemStatus } from '../../components/dashboard/LiveSystemStatus';
import { TodaysOperations } from '../../components/dashboard/TodaysOperations';
import { QuickManagementCards } from '../../components/dashboard/QuickManagementCards';
import { LiveMapPreview } from '../../components/dashboard/LiveMapPreview';
import { FleetPreview } from '../../components/dashboard/FleetPreview';
import { RecentActivityTimeline } from '../../components/dashboard/RecentActivityTimeline';
import { SystemHealthStatus } from '../../components/dashboard/SystemHealthStatus';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { DashboardErrorState } from '../../components/dashboard/DashboardErrorState';
import { LiveTrackingVehicle } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    liveTracking,
  } = useAdminDashboard();

  const [selectedVehicle, setSelectedVehicle] = useState<LiveTrackingVehicle | undefined>(undefined);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return <DashboardErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <DashboardHeader
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* WIDGET 1: LIVE SYSTEM STATUS */}
      <section>
        <LiveSystemStatus />
      </section>

      {/* WIDGET 2: TODAY'S OPERATIONS */}
      <section>
        <TodaysOperations />
      </section>

      {/* WIDGET 4: QUICK MANAGEMENT ACTION CARDS */}
      <section>
        <QuickManagementCards />
      </section>

      {/* WIDGET 5 & FLEET PREVIEW: LIVE MAP PREVIEW + FLEET TELEMATICS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveMapPreview
          vehicles={liveTracking}
          selectedVehicleId={selectedVehicle?.id}
          onSelectVehicle={setSelectedVehicle}
        />
        <FleetPreview
          shuttles={liveTracking}
          selectedVehicleId={selectedVehicle?.id}
          onSelectVehicle={setSelectedVehicle}
        />
      </section>

      {/* WIDGET 3: RECENT ACTIVITY TIMELINE */}
      <section>
        <RecentActivityTimeline />
      </section>

      {/* WIDGET 6: SYSTEM HEALTH */}
      <section>
        <SystemHealthStatus />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
