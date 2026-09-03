import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { SeatSelectionPage } from '../../components/employee/booking/SeatSelectionPage';
import { BoardingStopSelection } from '../../components/employee/booking/BoardingStopSelection';

export const EmployeeBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasBoardingStop = Boolean(searchParams.get('pickupStopId'));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title={hasBoardingStop ? 'Confirm Your Shuttle Ticket' : 'Choose Your Boarding Stop'}
        subtitle={hasBoardingStop ? 'Review your route, boarding stop, shuttle, destination, and arrival details before confirming.' : 'Select the boarding stop nearest to your live location before confirming your ticket.'}
      />

      {hasBoardingStop ? <SeatSelectionPage /> : <BoardingStopSelection />}
    </div>
  );
};

