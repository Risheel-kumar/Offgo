import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/common/headers/PageHeader';
import { Card } from '../../components/common/cards/Card';
import { useMyUpcomingBookings } from '../../hooks/useEmployeePortal';
import { Booking } from '../../types';
import { Bus, ShieldCheck, MapPin, User, Clock, Calendar, Loader2, XCircle } from 'lucide-react';

const timeToMinutes = (timeStr?: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const normalizeBookingDate = (dateStr?: string) => {
  if (!dateStr) return new Date();
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
};

const isBookingExpired = (booking: Booking, now = new Date()) => {
  if (!booking || !booking.date) return true;
  if (['CANCELLED', 'REJECTED', 'COMPLETED', 'NO_SHOW'].includes(String(booking.status).toUpperCase())) {
    return true;
  }

  const bookingDate = normalizeBookingDate(booking.date);
  const today = new Date(now);
  bookingDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return bookingDate < today;
};

const isBookingActive = (booking: Booking, now = new Date()) => {
  return !isBookingExpired(booking, now);
};

export const EmployeePassPage: React.FC = () => {
  const { data: bookings = [], isLoading } = useMyUpcomingBookings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const allPasses = useMemo(() => {
    const unique = new Map<string, Booking>();

    bookings.forEach((pass) => {
      const key = pass.bookingRef || pass.id || `${pass.routeName}-${pass.date}-${pass.seatNumber}`;
      unique.set(key, pass);
    });

    return [...unique.values()]
      .filter((pass) => !isBookingExpired(pass, now))
      .sort((a, b) => {
        const aTime = new Date(a.date || '2000-01-01').getTime() || 0;
        const bTime = new Date(b.date || '2000-01-01').getTime() || 0;
        return bTime - aTime;
      });
  }, [bookings, now]);

  const activeBooking = useMemo(() => {
    const valid = [...allPasses].filter((booking) => isBookingActive(booking, now));
    return valid.sort((a, b) => {
      const timeA = new Date(`${a.date}T00:00:00`).getTime() + (timeToMinutes(a.pickupTime) * 60000);
      const timeB = new Date(`${b.date}T00:00:00`).getTime() + (timeToMinutes(b.pickupTime) * 60000);
      return timeA - timeB;
    })[0] ?? null;
  }, [allPasses, now]);

  const passStatusLabel = activeBooking ? 'ACTIVE' : 'EXPIRED';

  if (isLoading) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
        <PageHeader title="Digital Boarding Pass" subtitle="Fetching your shuttle passes..." />
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          <span className="text-sm">Loading boarding passes</span>
        </div>
      </div>
    );
  }

  if (allPasses.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 flex flex-col items-center">
        <PageHeader title="Digital Boarding Pass" subtitle="Your booked shuttle passes will appear here when you reserve a ride." />

        <Card className="max-w-lg w-full bg-slate-900 text-white border-slate-800 shadow-2xl p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">No active shuttle</p>
              <h3 className="mt-2 text-2xl font-black text-white">No shuttles booked</h3>
            </div>
            <p className="text-sm text-slate-300">
              Your active pass will appear here while the current trip is in progress.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 flex flex-col items-center">
      <PageHeader
        title="Digital Boarding Pass"
        subtitle="Your booked shuttle passes are stored here and remain available until the trip window expires."
      />

      {activeBooking ? (
        <Card className="max-w-md w-full bg-slate-900 text-white border-slate-800 shadow-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-indigo-400" />
              <span className="font-extrabold text-sm text-white">OFF-GO BOARDING PASS</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {passStatusLabel}
            </span>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Seat</span>
            <h3 className="text-3xl font-black text-indigo-400 font-mono">SEAT {activeBooking.seatNumber ?? 'N/A'}</h3>
            <p className="text-xs text-slate-300 font-medium">Current active pass for this trip</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-400" /> Passenger</span>
              <span className="font-bold text-white">{activeBooking.employeeName || 'Employee'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 flex items-center gap-1.5"><Bus className="w-3.5 h-3.5 text-blue-400" /> Route</span>
              <span className="font-bold text-white">{activeBooking.routeName}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Pickup Stop</span>
              <span className="font-bold text-white">{activeBooking.pickupStop || activeBooking.pickupStopName || 'Pickup stop'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Shift</span>
              <span className="font-bold text-white">{activeBooking.pickupTime || 'Live route time'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Travel Date</span>
              <span className="font-mono font-bold text-indigo-400">{activeBooking.date}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Verified Corporate Commute Pass
          </div>
        </Card>
      ) : (
        <Card className="max-w-lg w-full bg-slate-900 text-white border-slate-800 shadow-2xl p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">No active shuttle</p>
              <h3 className="mt-2 text-2xl font-black text-white">No shuttles booked</h3>
            </div>
            <p className="text-sm text-slate-300">
              Your active pass will appear here while the current trip is in progress.
            </p>
          </div>
        </Card>
      )}

      {allPasses.length > 0 && (
        <div className="w-full max-w-5xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">All booked passes</h3>
            <span className="text-xs text-slate-500">{allPasses.length} saved</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {allPasses.map((pass) => (
              <Card key={`${pass.bookingRef || pass.id}-${pass.date}-${pass.seatNumber}`} className="bg-slate-900 border-slate-800 text-white p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">{pass.bookingRef || 'PASS'}</span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    isBookingActive(pass, now)
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isBookingActive(pass, now) ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Route</span>
                    <span className="font-semibold text-white text-right">{pass.routeName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Seat</span>
                    <span className="font-semibold text-indigo-400">{pass.seatNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Pickup</span>
                    <span className="font-semibold text-white text-right">{pass.pickupStop || pass.pickupStopName || 'Pickup stop'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Time</span>
                    <span className="font-semibold text-white">{pass.pickupTime || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Date</span>
                    <span className="font-semibold text-white">{pass.date || '—'}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

