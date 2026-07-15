package com.offgo.backend.dto.response.tracking;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RouteProgressResponse {

    private String currentStop;

    private String nextStop;

    private Integer currentStopOrder;

    private Integer totalStops;

    private Double progressPercentage;

    private Double remainingDistanceKm;

    private Integer estimatedArrivalMinutes;

}