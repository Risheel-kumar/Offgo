package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.notification.NotificationResponse;
import com.offgo.backend.entity.Notification;
import com.offgo.backend.repository.NotificationRepository;
import com.offgo.backend.service.notification.NotificationService;
import com.offgo.backend.service.websocket.NotificationPublisher;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationPublisher notificationPublisher;

    @Override
    public ApiResponse<Notification> createNotification(
            Notification notification) {
       log.info(
        "Notification stored");         
        Notification saved =
                notificationRepository.save(notification);

        NotificationResponse response =
                NotificationResponse.builder()
                        .id(saved.getId())
                        .title(saved.getTitle())
                        .message(saved.getMessage())
                        .type(saved.getType())
                        .read(saved.isRead())
                        .sentAt(saved.getSentAt())
                        .build();

        notificationPublisher.publish(response);
        log.info(
        "Notification pushed");
        return ApiResponse.<Notification>builder()
                .success(true)
                .message("Notification created successfully")
                .data(saved)
                .build();
    }

    @Override
    public ApiResponse<List<Notification>> getNotifications(
            UUID userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderBySentAtDesc(userId);

        return ApiResponse.<List<Notification>>builder()
                .success(true)
                .message("Notifications fetched successfully")
                .data(notifications)
                .build();
    }

}