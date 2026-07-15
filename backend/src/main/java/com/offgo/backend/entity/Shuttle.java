package com.offgo.backend.entity;

import java.util.UUID;

import com.offgo.backend.enums.ShuttleStatus;
import com.offgo.backend.enums.VehicleType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shuttles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shuttle extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false)
    private String vehicleName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false)
    private Integer capacity;

    @Builder.Default
    @Column(nullable = false)
    private Integer availableSeats = 0;

    @Builder.Default
    @Column(nullable = false)
    private boolean trackingEnabled = false;

    private Double latitude;

    private Double longitude;

    private java.time.LocalDateTime lastLocationUpdate;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShuttleStatus status;

}