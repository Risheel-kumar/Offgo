package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.shuttle.CreateShuttleRequest;
import com.offgo.backend.dto.request.shuttle.UpdateShuttleRequest;
import com.offgo.backend.dto.response.shuttle.ShuttleResponse;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.enums.ShuttleStatus;

@Component
public class ShuttleMapper {

    public Shuttle toEntity(CreateShuttleRequest request) {

        return Shuttle.builder()
                .vehicleNumber(request.getVehicleNumber())
                .vehicleName(request.getVehicleName())
                .vehicleType(request.getVehicleType())
                .capacity(request.getCapacity())
                .availableSeats(request.getCapacity())
                .status(ShuttleStatus.ACTIVE)
                .trackingEnabled(false)
                .active(true)
                .build();

    }

    public ShuttleResponse toResponse(Shuttle shuttle) {

        return ShuttleResponse.builder()
                .id(shuttle.getId())
                .vehicleNumber(shuttle.getVehicleNumber())
                .vehicleName(shuttle.getVehicleName())
                .vehicleType(shuttle.getVehicleType())
                .capacity(shuttle.getCapacity())
                .availableSeats(shuttle.getAvailableSeats())
                .status(shuttle.getStatus())
                .trackingEnabled(shuttle.isTrackingEnabled())
                .active(shuttle.isActive())
                .build();
    }

    public void updateEntity(
            Shuttle shuttle,
            UpdateShuttleRequest request) {

        shuttle.setVehicleNumber(request.getVehicleNumber());
        shuttle.setVehicleName(request.getVehicleName());
        shuttle.setVehicleType(request.getVehicleType());
        shuttle.setCapacity(request.getCapacity());
        shuttle.setStatus(request.getStatus());

    }

}