package com.offgo.backend.dto.response.tracking;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateLocationResponse {

    private UUID shuttleId;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double heading;

    private LocalDateTime recordedAt;

}