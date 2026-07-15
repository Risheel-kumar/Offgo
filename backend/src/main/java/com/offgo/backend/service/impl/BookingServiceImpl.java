package com.offgo.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import com.offgo.backend.dto.request.booking.CreateBookingRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.enums.BookingStatus;
import com.offgo.backend.enums.NotificationType;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.BookingMapper;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.service.booking.BookingService;
import com.offgo.backend.validator.BookingValidator;
import com.offgo.backend.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import com.offgo.backend.entity.Notification;
import com.offgo.backend.enums.NotificationType;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;
    private final ShuttleRepository shuttleRepository;
    private final BookingMapper bookingMapper;
    private final BookingValidator bookingValidator;
    private final NotificationService notificationService;

    @Override
    public ApiResponse<BookingResponse> createBooking(CreateBookingRequest request) {

        bookingValidator.validate(request);

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found"));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Schedule not found"));

        Shuttle shuttle = schedule.getShuttle();

        if (shuttle.getAvailableSeats() <= 0) {
            throw new BadRequestException("No seats available.");
        }

        int bookedSeats = bookingRepository
                .findByScheduleIdAndStatus(
                        schedule.getId(),
                        BookingStatus.BOOKED)
                .size();

        int nextSeat = bookedSeats + 1;

        Booking booking = Booking.builder()
        .employee(employee)
        .schedule(schedule)
        .seatNumber(nextSeat)
        .status(BookingStatus.BOOKED)
        .qrToken(UUID.randomUUID().toString())
        .qrGeneratedAt(LocalDateTime.now())
        .qrUsed(false)
        .build();

        bookingRepository.save(booking);



        shuttle.setAvailableSeats(
                shuttle.getAvailableSeats() - 1);

        shuttleRepository.save(shuttle);

        notificationService.createNotification(

                Notification.builder()
                        .userId(employee.getId())
                        .type(NotificationType.BOOKING)
                        .title("Booking Confirmed")
                        .message(
                                "Seat "
                                        + booking.getSeatNumber()
                                        + " has been reserved.")
                        .build()

        );

        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking Successful")
                .data(bookingMapper.toResponse(booking))
                .build();
    }

    @Override
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        log.info(
        "Fetching all bookings");
        List<BookingResponse> bookings =
                bookingRepository.findAll()
                        .stream()
                        .map(bookingMapper::toResponse)
                        .toList();

        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Bookings fetched successfully")
                .data(bookings)
                .build();
    }

    @Override
    public ApiResponse<BookingResponse> getBookingById(UUID id) {
        log.info(
        "Fetching booking {}",
        id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking fetched successfully")
                .data(bookingMapper.toResponse(booking))
                .build();
    }

    @Override
    public ApiResponse<String> cancelBooking(UUID id) {
        log.info(
        "Cancelling booking {}",
        id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {

            throw new BadRequestException(
                    "Booking already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Shuttle shuttle = booking.getSchedule().getShuttle();

        shuttle.setAvailableSeats(
                shuttle.getAvailableSeats() + 1);

        shuttleRepository.save(shuttle);

        bookingRepository.save(booking);
        log.info(
        "Booking cancelled");
        return ApiResponse.<String>builder()
                .success(true)
                .message("Booking Cancelled")
                .data("SUCCESS")
                .build();
    }

}