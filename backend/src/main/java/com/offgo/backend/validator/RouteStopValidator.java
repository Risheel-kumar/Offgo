package com.offgo.backend.validator;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.RouteStopRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RouteStopValidator {

    private final RouteStopRepository routeStopRepository;

    public void validateAssignment(UUID routeId, UUID stopId) {

        if (routeStopRepository.existsByRouteIdAndStopId(routeId, stopId)) {

            throw new DuplicateResourceException(
                    "Stop already assigned to this route.");

        }

    }

}