package com.offgo.backend.dto.request.schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateScheduleRequest {

    @NotNull
    private UUID routeId;

    @NotNull
    private UUID driverId;

    @NotNull
    private UUID shuttleId;

    @NotNull
    private LocalTime departureTime;

    @NotNull
    private LocalTime arrivalTime;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

}