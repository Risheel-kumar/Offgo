package com.offgo.backend.dto.request.attendance;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {

    @NotNull
    private UUID bookingId;

}