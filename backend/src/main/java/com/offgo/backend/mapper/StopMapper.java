package com.offgo.backend.mapper;

import org.springframework.stereotype.Component;

import com.offgo.backend.dto.request.stop.CreateStopRequest;
import com.offgo.backend.dto.response.stop.StopResponse;
import com.offgo.backend.entity.Stop;

@Component
public class StopMapper {

    public Stop toEntity(CreateStopRequest request) {

        return Stop.builder()
                .stopCode(request.getStopCode())
                .stopName(request.getStopName())
                .address(request.getAddress())
                .landmark(request.getLandmark())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

    }

    public StopResponse toResponse(Stop stop) {

        return StopResponse.builder()
                .id(stop.getId())
                .stopCode(stop.getStopCode())
                .stopName(stop.getStopName())
                .address(stop.getAddress())
                .landmark(stop.getLandmark())
                .latitude(stop.getLatitude())
                .longitude(stop.getLongitude())
                .active(stop.isActive())
                .build();

    }

}