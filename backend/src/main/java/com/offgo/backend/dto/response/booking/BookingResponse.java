package com.offgo.backend.dto.response.booking;

import java.util.UUID;
import java.math.BigDecimal;

import com.offgo.backend.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {

    private UUID id;

    private UUID employeeId;

    private UUID scheduleId;

    private UUID routeId;

    private UUID shuttleId;

    private UUID driverId;

    private String bookingRef;

    private String employeeName;

    private String employeeEmail;

    private String employeeDepartment;

    private String routeName;

    private String routeCode;

    private String shuttleNumber;

    private String driverName;

    private String pickupStopName;

    private String dropStopName;

    private String pickupTime;

    private String dropTime;

    private String travelDate;

    private String bookingDate;

    private Integer seatNumber;

    private BigDecimal transportChargeInr;

    private BookingStatus status;

    private String createdTime;

}