package com.offgo.backend.dto.response.tracking;

import java.time.LocalDateTime;
import java.util.UUID;
import java.time.LocalTime;

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

    private String driverId;

    private String driverName;

    private String driverPhone;

    private String routeId;

    private String routeName;

    private String routeCode;

    private String shuttleStatus;

    private Boolean shuttleActive;

    private Boolean trackingEnabled;

    private LocalTime departureTime;

    private LocalTime arrivalTime;

    private String scheduleStatus;

}