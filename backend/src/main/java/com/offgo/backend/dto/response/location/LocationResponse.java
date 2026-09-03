package com.offgo.backend.dto.response.location;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationResponse {

    private String shuttleNumber;

    private Double latitude;

    private Double longitude;

    private Double speed;

    private Double heading;

    private LocalDateTime updatedAt;

}