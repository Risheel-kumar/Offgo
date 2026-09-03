import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from '../../hooks/useBookings';
import { BookingDetailItem, BookingFilterOptions } from '../../types';
import { BookingHeader } from '../../components/bookings/BookingHeader';
import { BookingToolbar } from '../../components/bookings/BookingToolbar';
import { BookingTable } from '../../components/bookings/BookingTable';
import { BookingCalendar } from '../../components/bookings/BookingCalendar';
import { BookingDetailsDrawer } from '../../components/bookings/BookingDetailsDrawer';
import { BookingWizard } from '../../components/bookings/BookingWizard';
import { BookingSkeleton, EmptyState } from '../../components/bookings/BookingSkeleton';

export const BookingPage: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilterOptions>({
    searchQuery: '',
    bookingStatusFilter: 'ALL',
    travelDateFilter: 'ALL',
  });

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [selectedBooking, setSelectedBooking] = useState<BookingDetailItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // React Query Hooks
  const { bookings, isLoading, isFetching, refetch } = useBookings(filters);
  const createBookingMutation = useCreateBooking();
  const updateBookingMutation = useUpdateBooking();
  const deleteBookingMutation = useDeleteBooking();

  const handleFilterChange = (updated: Partial<BookingFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectBooking = (booking: BookingDetailItem) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const handleStatusChange = async (status: any) => {
    if (!selectedBooking) return;
    try {
      await updateBookingMutation.mutateAsync({
        id: selectedBooking.id,
        bookingStatus: status,
      });
      setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: status } : null));
      toast.success(`Booking status updated to ${status}`);
    } catch {
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking reservation?')) {
      try {
        await deleteBookingMutation.mutateAsync(id);
        toast.success('Booking record deleted');
        if (selectedBooking?.id === id) {
          setIsDrawerOpen(false);
          setSelectedBooking(null);
        }
      } catch {
        toast.error('Failed to delete booking');
      }
    }
  };

  const handleCreateBookingSubmit = async (payload: any) => {
    try {
      await createBookingMutation.mutateAsync(payload);
      toast.success('Shuttle booking created successfully');
    } catch {
      toast.error('Failed to create shuttle booking');
    }
  };

  const exportToCSV = () => {
    if (!bookings.length) {
      toast.error('No booking records to export');
      return;
    }

    const headers = [
      'Booking ID',
      'Employee ID',
      'Employee Name',
      'Route Name',
      'Shuttle',
      'Driver',
      'Pickup Stop',
      'Drop Stop',
      'Seat Number',
      'Travel Date',
      'Pickup Time',
      'Booking Status',
    ];

    const rows = bookings.map((b) => [
      b.code,
      b.employeeId,
      b.employeeName,
      `"${b.routeName}"`,
      b.shuttleNumber,
      b.driverName,
      `"${b.pickupStopName}"`,
      `"${b.dropStopName}"`,
      b.seatNumber,
      b.travelDate,
      b.pickupTime,
      b.bookingStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OffGo_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Export generated');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <BookingHeader />

      {/* Toolbar */}
      <BookingToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={() => refetch()}
        onExportCSV={exportToCSV}
        onCreateBooking={() => setIsWizardOpen(true)}
        isRefreshing={isFetching}
      />

      {/* Content View */}
      {isLoading ? (
        <BookingSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState
          onClearFilters={() => setFilters({ searchQuery: '', bookingStatusFilter: 'ALL', travelDateFilter: 'ALL' })}
          onCreateBooking={() => setIsWizardOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <BookingTable
          bookings={bookings}
          onSelectBooking={handleSelectBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      ) : (
        <BookingCalendar
          bookings={bookings}
          onSelectBooking={handleSelectBooking}
        />
      )}

      {/* Right Drawer */}
      <BookingDetailsDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteBooking}
      />

      {/* Booking Wizard Modal */}
      <BookingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleCreateBookingSubmit}
      />
    </div>
  );
};
