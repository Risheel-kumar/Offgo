package com.offgo.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.offgo.backend.enums.NotificationType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String message;

    @Builder.Default
    private boolean read = false;

    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();

}