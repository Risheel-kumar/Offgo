package com.offgo.backend.service.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.offgo.backend.dto.response.websocket.LiveLocationResponse;
import com.offgo.backend.service.websocket.LiveTrackingPublisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@RequiredArgsConstructor
public class LiveTrackingPublisherImpl implements LiveTrackingPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void publish(LiveLocationResponse response) {
                log.info(
            "Publishing Live Location: Shuttle={} Lat={} Lng={}",
            response.getVehicleNumber(),
            response.getLatitude(),
            response.getLongitude()
        );
        messagingTemplate.convertAndSend(
                "/topic/live-location",
                response);

    }

}