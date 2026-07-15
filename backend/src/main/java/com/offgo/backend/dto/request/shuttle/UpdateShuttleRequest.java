package com.offgo.backend.dto.request.shuttle;

import com.offgo.backend.enums.ShuttleStatus;
import com.offgo.backend.enums.VehicleType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateShuttleRequest {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotBlank(message = "Vehicle name is required")
    private String vehicleName;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1)
    private Integer capacity;

    @NotNull(message = "Status is required")
    private ShuttleStatus status;

}