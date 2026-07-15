package com.offgo.backend.dto.response.stop;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StopResponse {

    private UUID id;

    private String stopCode;

    private String stopName;

    private String address;

    private String landmark;

    private Double latitude;

    private Double longitude;

    private boolean active;

}