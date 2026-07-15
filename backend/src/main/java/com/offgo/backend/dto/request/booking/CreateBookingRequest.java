package com.offgo.backend.dto.request.booking;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull
    private UUID employeeId;

    @NotNull
    private UUID scheduleId;

}