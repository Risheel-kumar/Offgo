import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../common/cards/Card';
import { Table, Column } from '../common/tables/Table';
import { StatusChip } from '../common/tables/StatusChip';
import { LiveTrackingVehicle } from '../../types';
import { Bus, ArrowUpRight, Navigation } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface FleetPreviewProps {
  shuttles: LiveTrackingVehicle[];
  onSelectVehicle?: (vehicle: LiveTrackingVehicle) => void;
  selectedVehicleId?: string;
}

export const FleetPreview: React.FC<FleetPreviewProps> = ({
  shuttles,
  onSelectVehicle,
  selectedVehicleId,
}) => {
  const navigate = useNavigate();

  const columns: Column<LiveTrackingVehicle>[] = [
    {
      key: 'vehicleNumber',
      header: 'Vehicle / Route',
      render: (v) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Bus className="w-3.5 h-3.5 text-indigo-500" />
            {v.vehicleNumber}
          </span>
          <span className="text-xs text-slate-500">{v.routeName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => <StatusChip status={v.status} type="shuttle" />,
    },
    {
      key: 'speedKmH',
      header: 'Speed & Location',
      render: (v) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {v.speedKmH} km/h
          </span>
          <span className="text-slate-400 truncate max-w-[180px]">
            {v.currentLocation.address}
          </span>
        </div>
      ),
    },
    {
      key: 'occupancy',
      header: 'Occupancy',
      render: (v) => {
        const percent = Math.round((v.occupancy / v.capacity) * 100);
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{v.occupancy}/{v.capacity}</span>
            <div className="w-14 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${percent > 85 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'driverName',
      header: 'Assigned Driver',
      render: (v) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{v.driverName}</span>,
    },
    {
      key: 'lastUpdated',
      header: 'Telemetry Ping',
      render: (v) => <span className="text-xs text-slate-400">{v.lastUpdated}</span>,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Navigation className="w-4 h-4 text-indigo-500" /> Live Fleet Telematics Overview
          </CardTitle>
          <p className="text-xs text-slate-400">Real-time status of active dispatched shuttles</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/tracking')}
          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
        >
          Full Live Map
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table
          columns={columns}
          data={shuttles}
          keyExtractor={(v) => v.id}
          onRowClick={(v) => onSelectVehicle && onSelectVehicle(v)}
          className="border-none rounded-none shadow-none"
        />
      </CardContent>
    </Card>
  );
};
