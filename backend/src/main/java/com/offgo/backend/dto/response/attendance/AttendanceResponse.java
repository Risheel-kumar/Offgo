package com.offgo.backend.dto.response.attendance;

import java.time.LocalDateTime;
import java.util.UUID;

import com.offgo.backend.enums.AttendanceStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AttendanceResponse {

    private UUID id;

    private String employeeName;

    private String routeName;

    private Integer seatNumber;

    private AttendanceStatus status;

    private LocalDateTime checkInTime;

}