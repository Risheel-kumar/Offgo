package com.offgo.backend.entity;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;

import com.offgo.backend.enums.BookingStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(nullable = false, unique = true, length = 100)
    private String qrToken;

    @Builder.Default
    @Column(nullable = false)
    private Boolean qrUsed = false;

    private LocalDateTime qrGeneratedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(nullable = false)
    private Integer seatNumber;

    @Builder.Default
    @Column(name = "transport_charge_inr", precision = 10, scale = 2)
    private BigDecimal transportChargeInr = BigDecimal.ZERO;


    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.BOOKED;

}