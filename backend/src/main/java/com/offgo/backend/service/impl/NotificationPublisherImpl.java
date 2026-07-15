package com.offgo.backend.service.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.offgo.backend.dto.response.notification.NotificationResponse;
import com.offgo.backend.service.websocket.NotificationPublisher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationPublisherImpl
        implements NotificationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void publish(NotificationResponse notification) {

        log.info(
                "Notification Published : {}",
                notification.getTitle());

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                notification);

    }

}