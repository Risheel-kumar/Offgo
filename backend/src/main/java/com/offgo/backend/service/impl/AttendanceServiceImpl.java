package com.offgo.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.dto.request.attendance.AttendanceRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.attendance.AttendanceResponse;
import com.offgo.backend.entity.Attendance;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.enums.AttendanceStatus;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.AttendanceMapper;
import com.offgo.backend.repository.AttendanceRepository;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.service.attendance.AttendanceService;
import com.offgo.backend.validator.AttendanceValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final BookingRepository bookingRepository;
    private final AttendanceMapper attendanceMapper;
    private final AttendanceValidator attendanceValidator;

    @Override
    public ApiResponse<AttendanceResponse> checkIn(
            AttendanceRequest request) {
                log.info(
        "Attendance request received");
        attendanceValidator.validate(request);

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));
        log.info(
        "Booking {} found",
        booking.getId());
        Attendance attendance = attendanceRepository
                .findByBookingId(booking.getId())
                .orElse(
                        Attendance.builder()
                                .booking(booking)
                                .build());

        attendance.setStatus(AttendanceStatus.CHECKED_IN);
        attendance.setCheckInTime(LocalDateTime.now());

        attendanceRepository.save(attendance);
        log.info(
        "Attendance saved");
        return ApiResponse.<AttendanceResponse>builder()
                .success(true)
                .message("Attendance marked successfully")
                .data(attendanceMapper.toResponse(attendance))
                .build();
    }

    @Override
    public ApiResponse<List<AttendanceResponse>> getAllAttendance() {

        List<AttendanceResponse> list = attendanceRepository.findAll()
                .stream()
                .map(attendanceMapper::toResponse)
                .toList();

        return ApiResponse.<List<AttendanceResponse>>builder()
                .success(true)
                .message("Attendance fetched successfully")
                .data(list)
                .build();
    }

    @Override
    public ApiResponse<AttendanceResponse> getAttendanceByBooking(
            UUID bookingId) {
        log.info(
        "Fetching attendance");
        Attendance attendance = attendanceRepository
                .findByBookingId(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Attendance not found"));

        return ApiResponse.<AttendanceResponse>builder()
                .success(true)
                .message("Attendance fetched successfully")
                .data(attendanceMapper.toResponse(attendance))
                .build();
    }
}