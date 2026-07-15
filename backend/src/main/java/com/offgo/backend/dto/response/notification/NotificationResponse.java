package com.offgo.backend.dto.response.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import com.offgo.backend.enums.NotificationType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {

    private UUID id;

    private String title;

    private String message;

    private NotificationType type;

    private boolean read;

    private LocalDateTime sentAt;

}