package com.offgo.backend.service.websocket;

import com.offgo.backend.dto.response.notification.NotificationResponse;

public interface NotificationPublisher {

    void publish(NotificationResponse notification);

}