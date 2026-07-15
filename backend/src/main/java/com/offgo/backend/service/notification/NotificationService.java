package com.offgo.backend.service.notification;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.entity.Notification;

public interface NotificationService {

    ApiResponse<Notification> createNotification(Notification notification);

    ApiResponse<List<Notification>> getNotifications(UUID userId);

}