package com.offgo.backend.dto.response.websocket;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LiveLocationResponse {

    private UUID shuttleId;

    private String vehicleNumber;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double heading;

    private LocalDateTime timestamp;

}