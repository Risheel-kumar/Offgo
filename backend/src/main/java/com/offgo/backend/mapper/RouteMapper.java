package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.route.CreateRouteRequest;
import com.offgo.backend.dto.request.route.UpdateRouteRequest;
import com.offgo.backend.dto.response.route.RouteResponse;
import com.offgo.backend.entity.Route;

@Component
public class RouteMapper {

    public Route toEntity(CreateRouteRequest request) {

        return Route.builder()
                .routeCode(request.getRouteCode())
                .routeName(request.getRouteName())
                .source(request.getSource())
                .destination(request.getDestination())
                .distanceKm(request.getDistanceKm())
                .estimatedDurationMinutes(request.getEstimatedDurationMinutes())
                .build();

    }

    public RouteResponse toResponse(Route route) {

        return RouteResponse.builder()
                .id(route.getId())
                .routeCode(route.getRouteCode())
                .routeName(route.getRouteName())
                .source(route.getSource())
                .destination(route.getDestination())
                .distanceKm(route.getDistanceKm())
                .estimatedDurationMinutes(route.getEstimatedDurationMinutes())
                .status(route.getStatus())
                .active(route.isActive())
                .build();

    }

    public void updateEntity(
            Route route,
            UpdateRouteRequest request) {

        route.setRouteName(request.getRouteName());
        route.setSource(request.getSource());
        route.setDestination(request.getDestination());
        route.setDistanceKm(request.getDistanceKm());
        route.setEstimatedDurationMinutes(
                request.getEstimatedDurationMinutes());

    }

}