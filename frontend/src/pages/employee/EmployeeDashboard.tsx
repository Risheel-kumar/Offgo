import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useMyUpcomingBookings,
  useMyBookingHistory,
} from '../../hooks/useEmployeePortal';
import { ReserveSeatWidget } from '../../components/employee/ReserveSeatWidget';
import { MyRidesSection } from '../../components/employee/MyRidesSection';
import { SelectedCommutePanel } from '../../components/employee/SelectedCommutePanel';

export const EmployeeDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();

  const { data: upcomingBookings, refetch: refetchUpcoming } = useMyUpcomingBookings();
  const { data: history, refetch: refetchHistory } = useMyBookingHistory();
  const selectedRouteId = searchParams.get('routeId');
  const selectedPickupStopId = searchParams.get('pickupStopId');

  const handleCancelBooking = (bookingId: string) => {
    refetchUpcoming();
    refetchHistory();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      <section>
        <ReserveSeatWidget />
      </section>

      {selectedRouteId && selectedPickupStopId && (
        <SelectedCommutePanel routeId={selectedRouteId} pickupStopId={selectedPickupStopId} />
      )}

      <section>
        <MyRidesSection
          upcomingBookings={upcomingBookings || []}
          bookingHistory={history || []}
          onCancelBooking={handleCancelBooking}
        />
      </section>
    </div>
  );
};
