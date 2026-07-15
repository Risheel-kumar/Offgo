package com.offgo.backend.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.offgo.backend.service.eta.ETAService;
import com.offgo.backend.service.notification.NotificationService;
import com.offgo.backend.service.tracking.TrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class ShuttleScheduler {

    private final TrackingService trackingService;

private final ETAService etaService;

private final NotificationService notificationService;

    @Scheduled(fixedRate = 30000)
    public void updateLiveOperations() {

        log.info("Running scheduled shuttle update...");

    }

}