package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.attendance.AttendanceRequest;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.repository.AttendanceRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AttendanceValidator {

    private final AttendanceRepository attendanceRepository;

    public void validate(AttendanceRequest request) {

        attendanceRepository.findByBookingId(request.getBookingId())
                .ifPresent(attendance -> {

                    if (attendance.getStatus().name().equals("CHECKED_IN")) {

                        throw new BadRequestException(
                                "Attendance already marked.");
                    }

                });
    }

}