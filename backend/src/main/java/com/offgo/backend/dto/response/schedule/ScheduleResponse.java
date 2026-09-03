package com.offgo.backend.dto.response.schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.offgo.backend.enums.ScheduleStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScheduleResponse {

    private UUID id;

    private UUID routeId;

    private UUID driverId;

    private UUID shuttleId;

    private Boolean trackingEnabled;

    private String routeName;

    private String driverName;

    private String shuttleNumber;

    private LocalTime departureTime;

    private LocalTime arrivalTime;

    private LocalDate startDate;

    private LocalDate endDate;

    private ScheduleStatus status;

}