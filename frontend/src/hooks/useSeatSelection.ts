import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seatService } from '../services/seatService';
import { ShuttleSeatLayout, SeatItem, SeatBookingPayload } from '../types';
import toast from 'react-hot-toast';

export const useAvailableSeats = (
  vehicleId: string = 'shuttle-101',
  shuttleName: string = 'Outer Ring Road Express Shuttle',
  vehicleNumber: string = 'OFF-GO-101',
  driverName: string = 'David Miller'
) => {
  return useQuery<ShuttleSeatLayout, Error>({
    queryKey: ['seatLayout', vehicleId],
    queryFn: () => seatService.getSeatLayout(vehicleId, shuttleName, vehicleNumber, driverName),
    staleTime: 30000,
  });
};

export const useSeatSelection = (initialSeat?: SeatItem | null) => {
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>(initialSeat || null);
  const [hoveredSeat, setHoveredSeat] = useState<SeatItem | null>(null);

  const selectSeat = useCallback((seat: SeatItem) => {
    if (seat.status === 'RESERVED' || seat.status === 'BLOCKED' || seat.status === 'UNAVAILABLE') {
      toast.error(`Seat ${seat.seatNumber} is ${seat.status.toLowerCase()} and cannot be selected.`);
      return;
    }

    setSelectedSeat((prev) => {
      // Toggle or switch
      if (prev?.seatNumber === seat.seatNumber) {
        return null;
      }
      return { ...seat, status: 'SELECTED' };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeat(null);
  }, []);

  return {
    selectedSeat,
    hoveredSeat,
    setHoveredSeat,
    selectSeat,
    clearSelection,
  };
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SeatBookingPayload) => seatService.confirmSeatBooking(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seatLayout', variables.shuttleId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my_upcoming_bookings'] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to complete seat reservation.');
    },
  });
};
