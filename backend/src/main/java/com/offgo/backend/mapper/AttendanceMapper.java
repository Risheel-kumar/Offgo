package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.response.attendance.AttendanceResponse;
import com.offgo.backend.entity.Attendance;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeName(
                        attendance.getBooking()
                                .getEmployee()
                                .getFirstName()
                        + " "
                        + attendance.getBooking()
                                .getEmployee()
                                .getLastName())
                .routeName(
                        attendance.getBooking()
                                .getSchedule()
                                .getRoute()
                                .getRouteName())
                .seatNumber(
                        attendance.getBooking()
                                .getSeatNumber())
                .status(attendance.getStatus())
                .checkInTime(attendance.getCheckInTime())
                .build();
    }
}