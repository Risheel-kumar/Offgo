package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.response.route.RouteStopResponse;
import com.offgo.backend.entity.RouteStop;

@Component
public class RouteStopMapper {

    public RouteStopResponse toResponse(RouteStop routeStop) {

        return RouteStopResponse.builder()
                .id(routeStop.getId())
                .stopId(routeStop.getStop().getId())
                .stopCode(routeStop.getStop().getStopCode())
                .stopName(routeStop.getStop().getStopName())
                .address(routeStop.getStop().getAddress())
                .latitude(routeStop.getStop().getLatitude())
                .longitude(routeStop.getStop().getLongitude())
                .stopOrder(routeStop.getStopOrder())
                .estimatedArrivalOffsetMinutes(
                        routeStop.getEstimatedArrivalOffsetMinutes())
                .build();

    }

}