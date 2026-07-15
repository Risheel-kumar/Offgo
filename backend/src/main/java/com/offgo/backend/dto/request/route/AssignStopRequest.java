package com.offgo.backend.dto.request.route;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignStopRequest {

    @NotNull
    private UUID stopId;

    @NotNull
    @Min(1)
    private Integer stopOrder;

    @NotNull
    @Min(0)
    private Integer estimatedArrivalOffsetMinutes;

}