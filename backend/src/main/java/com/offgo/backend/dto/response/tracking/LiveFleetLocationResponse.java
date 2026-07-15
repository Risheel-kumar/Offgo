package com.offgo.backend.dto.response.tracking;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LiveFleetLocationResponse {

    private UUID shuttleId;

    private String vehicleNumber;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double heading;

    private LocalDateTime updatedAt;

}