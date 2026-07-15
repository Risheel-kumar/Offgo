package com.offgo.backend.dto.response.tracking;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentStopResponse {

    private String currentStop;

    private String nextStop;

    private Double distanceToCurrentStopKm;

    private Double distanceToNextStopKm;

    private Integer stopOrder;

}