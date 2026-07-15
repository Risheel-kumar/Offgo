package com.offgo.backend.validator;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.route.CreateRouteRequest;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.RouteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RouteValidator {

    private final RouteRepository routeRepository;

    public void validateCreate(CreateRouteRequest request) {

        if (routeRepository.existsByRouteCode(request.getRouteCode())) {

            throw new DuplicateResourceException(
                    "Route code already exists.");

        }

    }

}