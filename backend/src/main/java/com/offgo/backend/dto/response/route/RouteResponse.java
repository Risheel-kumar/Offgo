package com.offgo.backend.dto.response.route;

import java.math.BigDecimal;
import java.util.UUID;

import com.offgo.backend.enums.RouteStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RouteResponse {

    private UUID id;

    private String routeCode;

    private String routeName;

    private String source;

    private String destination;

    private BigDecimal distanceKm;

    private Integer estimatedDurationMinutes;

    private RouteStatus status;

    private boolean active;

    private UUID driverId;

    private String driverName;

}