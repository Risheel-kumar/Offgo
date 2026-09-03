import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../common/cards/Card';
import { MapPin, Users, Building2, Gauge } from 'lucide-react';
import { DriverTripNavigationState } from '../../services/driverNavigationService';

interface TripSummaryCardProps {
  trip: DriverTripNavigationState | null;
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ trip }) => {
  const office = trip?.officeDestination || {
    name: 'Tech Park Main Office HQ',
    address: 'Building 4B, Off-Go Campus',
  };

  const metrics = [
    {
      id: 'waypoints',
      label: 'Waypoints',
      value: `${trip?.progress.completedStopsCount || 0} / ${trip?.progress.totalStopsCount || 4}`,
      subtext: 'Pickup Stops Reached',
      icon: MapPin,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'passengers',
      label: 'Passengers',
      value: `${trip?.passengerStats.boarded || 0} / ${trip?.passengerStats.totalBookings || 32}`,
      subtext: 'Boarded vs Reserved',
      icon: Users,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'speed',
      label: 'Current Speed',
      value: `${trip?.currentLocation.speedKmH || 0} km/h`,
      subtext: 'Telematics Speed',
      icon: Gauge,
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-slate-900 text-white border-slate-800 shadow-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
        <CardContent className="p-6 space-y-5 relative z-10">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                  PRIMARY DESTINATION
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{office.name}</h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                TARGET OFFICE ARRIVAL
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {trip?.progress.estimatedOfficeArrival || '09:15 AM'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                    <Icon className={`w-4 h-4 ${m.iconColor}`} />
                    <span>{m.label}</span>
                  </div>
                  <p className="text-lg font-black text-white tracking-tight">{m.value}</p>
                  <span className="text-[10px] text-slate-400 block">{m.subtext}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

