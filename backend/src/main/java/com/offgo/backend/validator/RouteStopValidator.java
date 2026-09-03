package com.offgo.backend.validator;

import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.RouteStopRepository;
import com.offgo.backend.repository.StopRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RouteStopValidator {

    private final RouteStopRepository routeStopRepository;
    private final StopRepository stopRepository;

    public void validateAssignment(UUID routeId, UUID stopId) {
        UUID safeRouteId = Objects.requireNonNull(routeId, "routeId");
        UUID safeStopId = Objects.requireNonNull(stopId, "stopId");

        if (routeStopRepository.existsByRouteIdAndStopId(safeRouteId, safeStopId)) {
            throw new DuplicateResourceException(
                    "This stop is already available in this route.");
        }

        var candidateStop = stopRepository.findById(safeStopId)
            .orElseThrow(() -> new IllegalArgumentException("Stop not found"));
        routeStopRepository.findByRouteIdOrderByStopOrderAsc(safeRouteId).stream()
            .map(routeStop -> routeStop.getStop())
            .filter(existingStop -> isSameLocation(existingStop, candidateStop))
                .findFirst()
                .ifPresent(existingStop -> {
                    throw new DuplicateResourceException(
                            "This stop is already available in this route.");
                });
    }

    private boolean isSameLocation(com.offgo.backend.entity.Stop existingStop, com.offgo.backend.entity.Stop candidateStop) {
        boolean sameAddress = existingStop.getAddress() != null
                && existingStop.getAddress().trim().equalsIgnoreCase(candidateStop.getAddress().trim());
        boolean sameCoordinates = existingStop.getLatitude() != null
                && existingStop.getLongitude() != null
                && Math.abs(existingStop.getLatitude() - candidateStop.getLatitude()) < 0.00001
                && Math.abs(existingStop.getLongitude() - candidateStop.getLongitude()) < 0.00001;
        return sameAddress || sameCoordinates;
    }
}