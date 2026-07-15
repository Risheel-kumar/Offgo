package com.offgo.backend.controller.notification;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.entity.Notification;
import com.offgo.backend.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                notificationService.getNotifications(userId));

    }

}