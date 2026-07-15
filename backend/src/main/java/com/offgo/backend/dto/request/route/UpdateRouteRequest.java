package com.offgo.backend.dto.request.route;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRouteRequest {

    @NotBlank
    private String routeName;

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    @DecimalMin("0.1")
    private BigDecimal distanceKm;

    @NotNull
    @Min(1)
    private Integer estimatedDurationMinutes;

}