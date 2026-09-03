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
                .status(ShuttleStatus.INACTIVE)
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
                .status(shuttle.getStatus() == ShuttleStatus.MAINTENANCE
                    ? ShuttleStatus.MAINTENANCE
                    : shuttle.isTrackingEnabled() ? ShuttleStatus.ACTIVE : ShuttleStatus.INACTIVE)
                .trackingEnabled(shuttle.isTrackingEnabled())
                .active(shuttle.isActive())
                .routeId(shuttle.getRoute() != null ? shuttle.getRoute().getId() : null)
                .routeName(shuttle.getRoute() != null ? shuttle.getRoute().getRouteName() : null)
                .driverId(shuttle.getDriver() != null ? shuttle.getDriver().getId() : null)
                .driverName(shuttle.getDriver() != null ? shuttle.getDriver().getFirstName() + " " + shuttle.getDriver().getLastName() : null)
                .driverPhone(shuttle.getDriver() != null ? shuttle.getDriver().getPhoneNumber() : null)
                .driverEmail(shuttle.getDriver() != null ? shuttle.getDriver().getEmail() : null)
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