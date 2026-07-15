package com.offgo.backend.dto.response.tracking;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationHistoryResponse {

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double heading;

    private LocalDateTime recordedAt;

}
