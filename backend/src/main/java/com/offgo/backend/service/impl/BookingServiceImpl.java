package com.offgo.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.dto.request.booking.CreateBookingRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.booking.BookingResponse;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.entity.Notification;
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
import com.offgo.backend.repository.UserRepository;
import com.offgo.backend.service.booking.BookingService;
import com.offgo.backend.service.notification.NotificationService;
import com.offgo.backend.validator.BookingValidator;

import lombok.RequiredArgsConstructor;
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
        private final UserRepository userRepository;

        private BookingResponse mapBookingSafely(Booking booking) {
                try {
                        return bookingMapper.toResponse(booking);
                } catch (RuntimeException exception) {
                        log.warn("Skipping booking {} because it could not be mapped: {}", booking.getId(), exception.getMessage());
                        return null;
                }
        }

    @Override
    public ApiResponse<BookingResponse> createBooking(CreateBookingRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId()).orElseGet(() ->
                userRepository.findById(request.getEmployeeId())
                        .flatMap(user -> employeeRepository.findByEmployeeCode(user.getEmployeeId()))
                        .orElseThrow(() -> new ResourceNotFoundException("Employee not found")));
        request.setEmployeeId(employee.getId());
        bookingValidator.validate(request);
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        Shuttle shuttle = schedule.getShuttle();
        if (shuttle.getAvailableSeats() <= 0) {
            throw new BadRequestException("No seats available.");
        }

        int reservedSeats = bookingRepository.findByScheduleIdAndStatus(schedule.getId(), BookingStatus.APPROVED).size();
        Booking booking = Booking.builder()
                .employee(employee)
                .schedule(schedule)
                .seatNumber(reservedSeats + 1)
                .status(BookingStatus.PENDING)
                .qrToken(UUID.randomUUID().toString())
                .qrGeneratedAt(LocalDateTime.now())
                .qrUsed(false)
                .transportChargeInr(BigDecimal.valueOf(schedule.getRoute().getDistanceKm().doubleValue() * 7))
                .build();
        bookingRepository.save(booking);

        notificationService.createNotification(Notification.builder()
                .userId(employee.getId())
                .type(NotificationType.BOOKING)
                .title("Booking Pending Approval")
                .message("Your shuttle booking request is awaiting administrator approval.")
                .build());

        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking submitted for approval")
                .data(bookingMapper.toResponse(booking))
                .build();
    }

    @Override
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingRepository.findAll().stream()
                .map(this::mapBookingSafely)
                .filter(Objects::nonNull)
                .toList();
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Bookings fetched successfully")
                .data(bookings)
                .build();
    }

    @Override
    public ApiResponse<List<BookingResponse>> getBookingsByEmployeeId(UUID employeeId) {
        List<BookingResponse> bookings = bookingRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapBookingSafely)
                .filter(Objects::nonNull)
                .toList();
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Employee bookings fetched successfully")
                .data(bookings)
                .build();
    }

    @Override
    public ApiResponse<BookingResponse> getBookingById(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking fetched successfully")
                .data(bookingMapper.toResponse(booking))
                .build();
    }

    @Override
    public ApiResponse<String> cancelBooking(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking already cancelled.");
        }
        BookingStatus previous = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);
        if (previous == BookingStatus.APPROVED || previous == BookingStatus.BOOKED) {
            Shuttle shuttle = booking.getSchedule().getShuttle();
            shuttle.setAvailableSeats(shuttle.getAvailableSeats() + 1);
            shuttleRepository.save(shuttle);
        }
        bookingRepository.save(booking);
        return ApiResponse.<String>builder()
                .success(true)
                .message("Booking Cancelled")
                .data("SUCCESS")
                .build();
    }

    @Override
    public ApiResponse<BookingResponse> updateStatus(UUID id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        BookingStatus previous = booking.getStatus();
        Shuttle shuttle = booking.getSchedule().getShuttle();
        if (status == BookingStatus.APPROVED && previous != BookingStatus.APPROVED) {
            if (shuttle.getAvailableSeats() <= 0) {
                throw new BadRequestException("No seats available.");
            }
            shuttle.setAvailableSeats(shuttle.getAvailableSeats() - 1);
            shuttleRepository.save(shuttle);
        } else if (status == BookingStatus.REJECTED && previous == BookingStatus.APPROVED) {
            shuttle.setAvailableSeats(shuttle.getAvailableSeats() + 1);
            shuttleRepository.save(shuttle);
        }
        booking.setStatus(status);
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking status updated")
                .data(bookingMapper.toResponse(bookingRepository.save(booking)))
                .build();
    }
}
