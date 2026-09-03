import React from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card, CardContent } from '../../components/common/cards/Card';
import { Table, Column } from '../../components/common/tables/Table';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '../../services/scheduleService';

interface DriverTrip {
  id: string;
  tripCode: string;
  routeName: string;
  departureTime: string;
  passengerCount: number;
  status: string;
}

export const DriverTripsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: schedules = [], isLoading, isError } = useQuery({
    queryKey: ['driver-schedules', user?.id],
    queryFn: () => scheduleService.getSchedules({ driverFilter: user?.id }),
    enabled: Boolean(user?.id),
  });
  const trips: DriverTrip[] = schedules
    .filter((schedule) => !user?.id || schedule.driverId === user.id)
    .map((schedule) => ({
      id: schedule.id,
      tripCode: schedule.code || schedule.id,
      routeName: schedule.routeName,
      departureTime: schedule.departureTime,
      passengerCount: schedule.estimatedStopsCount,
      status: schedule.status,
    }));
  const columns: Column<DriverTrip>[] = [
    {
      key: 'tripCode',
      header: 'Trip Code',
      render: (t) => <span className="font-mono font-bold text-indigo-600">{t.tripCode}</span>,
    },
    { key: 'routeName', header: 'Route' },
    { key: 'departureTime', header: 'Departure' },
    { key: 'passengerCount', header: 'Booked Passengers' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="Assigned Roster Trips"
        subtitle="Review scheduled shuttle runs for your active shift."
      />

      <Card>
        <CardContent className="p-0">
          {isLoading && <div className="p-6 text-sm text-slate-500">Loading assigned trips...</div>}
          {isError && <div className="p-6 text-sm text-red-600">Unable to load assigned trips.</div>}
          {!isLoading && !isError && <Table columns={columns} data={trips} keyExtractor={(t) => t.id} />}
        </CardContent>
      </Card>
    </div>
  );
};
