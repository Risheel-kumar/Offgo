package com.offgo.backend.dto.response.shuttle;

import java.util.UUID;

import com.offgo.backend.enums.ShuttleStatus;
import com.offgo.backend.enums.VehicleType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShuttleResponse {

    private UUID id;

    private String vehicleNumber;

    private String vehicleName;

    private VehicleType vehicleType;

    private Integer capacity;

    private Integer availableSeats;

    private ShuttleStatus status;

    private Boolean trackingEnabled;

    private Boolean active;

    private UUID routeId;

    private String routeName;

    private UUID driverId;

    private String driverName;

    private String driverPhone;

    private String driverEmail;

}