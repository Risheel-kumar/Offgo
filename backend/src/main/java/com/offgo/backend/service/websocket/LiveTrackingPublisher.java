package com.offgo.backend.service.websocket;

import com.offgo.backend.dto.response.websocket.LiveLocationResponse;

public interface LiveTrackingPublisher {

    void publish(LiveLocationResponse response);

}