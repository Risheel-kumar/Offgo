import React, { useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { TripHeader } from '../../components/driver/TripHeader';
import { TripSummaryCard } from '../../components/driver/TripSummaryCard';
import { DriverGoogleMap } from '../../components/driver/DriverGoogleMap';
import { CurrentStopCard } from '../../components/driver/CurrentStopCard';
import { NextStopCard } from '../../components/driver/NextStopCard';
import { RouteTimeline } from '../../components/driver/RouteTimeline';
import { PassengerSummaryCard } from '../../components/driver/PassengerSummaryCard';
import { TripProgressCard } from '../../components/driver/TripProgressCard';
import { TripControls } from '../../components/driver/TripControls';
import { StartShiftModal } from '../../components/driver/StartShiftModal';

import { useCurrentTrip, useDriverRoute, useNavigation } from '../../hooks/useDriverNavigation';

export const DriverNavigationPage: React.FC = () => {
  const { trip, setTrip, isLoading } = useCurrentTrip();
  const { stops, activeStopIndex, currentStop, nextStop, officeDestination, distanceToCurrentStopMeters, isWithinArrivalRadius } = useDriverRoute(trip);

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const {
    isProcessing,
    startShift,
    markStopCompleted,
    pauseTrip,
    resumeTrip,
    endTrip,
    resetTrip,
  } = useNavigation((updated) => setTrip(updated), trip);

  const handleConfirmStartShift = async () => {
    await startShift();
  };

  const handleMarkCompleted = async (stopId: string) => {
    if (!isWithinArrivalRadius) return;
    await markStopCompleted(stopId);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Page Breadcrumb Header */}
      <PageHeader
        title="Driver Navigation & Shift Execution"
        subtitle="Turn-by-turn route telematics, stop confirmations, and direct navigation to Office HQ."
      />

      {isLoading && <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-sm text-slate-500">Loading your assigned route...</div>}
      {!isLoading && !trip && <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">No assigned schedule was found for this driver.</div>}

      {/* Main Shift Header Banner */}
      <TripHeader
        trip={trip}
        onStartShiftClick={() => setIsStartModalOpen(true)}
        onPauseClick={pauseTrip}
        onResumeClick={resumeTrip}
        onEndTripClick={endTrip}
        onResetClick={resetTrip}
        isProcessing={isProcessing}
      />

      {/* Quick Summary Metric Grid */}
      <TripSummaryCard trip={trip} />

      {/* Main Content Responsive Layout (Desktop 2-Col Split, Mobile Bottom Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols on Desktop): Live Google Map & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <DriverGoogleMap trip={trip} className="h-[520px] w-full" />

          {/* Current & Next Stop Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrentStopCard
              currentStop={currentStop}
              onMarkCompleted={handleMarkCompleted}
              isShiftRunning={trip?.status === 'RUNNING'}
              distanceToStopMeters={distanceToCurrentStopMeters}
              isWithinArrivalRadius={isWithinArrivalRadius}
              totalStops={stops.length}
            />
            <NextStopCard nextStop={nextStop} />
          </div>

          {/* Sticky / Inline Controls */}
          <TripControls
            trip={trip}
            currentStop={currentStop}
            onStartShiftClick={() => setIsStartModalOpen(true)}
            onMarkCompleted={handleMarkCompleted}
            onPauseClick={pauseTrip}
            onResumeClick={resumeTrip}
            onEndTripClick={endTrip}
            onResetClick={resetTrip}
            isProcessing={isProcessing}
            isWithinArrivalRadius={isWithinArrivalRadius}
          />
        </div>

        {/* Right Column (5 Cols on Desktop): Timeline & Passenger Manifest */}
        <div className="lg:col-span-5 space-y-6">
          <TripProgressCard
            progress={trip?.progress}
            officeName={officeDestination.name}
          />

          <PassengerSummaryCard stats={trip?.passengerStats} />

          <RouteTimeline
            stops={stops}
            activeStopIndex={activeStopIndex}
            onMarkCompleted={handleMarkCompleted}
            isShiftRunning={trip?.status === 'RUNNING'}
          />
        </div>
      </div>

      {/* Confirm Start Shift Modal */}
      <StartShiftModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onConfirm={handleConfirmStartShift}
        routeName={trip?.routeName || 'Outer Ring Road Express'}
        vehicleNumber={trip?.vehicleNumber || 'KA-01-MJ-8902'}
        officeName={officeDestination.name}
        stopCount={stops.length - 1}
        totalPassengers={trip?.passengerStats.totalBookings || 32}
      />
    </div>
  );
};

export default DriverNavigationPage;
