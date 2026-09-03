package com.offgo.backend.dto.response.route;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RouteStopResponse {

    private UUID id;

    private UUID stopId;

    private String stopCode;

    private String stopName;

    private String address;

    private Double latitude;

    private Double longitude;

    private Integer stopOrder;

    private Integer estimatedArrivalOffsetMinutes;

}