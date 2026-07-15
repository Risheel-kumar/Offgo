package com.offgo.backend.dto.response.tracking;

import com.offgo.backend.enums.ETAStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ETAResponse {

    private String shuttleNumber;

    private String currentStop;

    private String nextStop;

    private Double remainingDistanceKm;

    private Integer estimatedArrivalMinutes;

    private Double averageSpeed;

    private ETAStatus status;

}