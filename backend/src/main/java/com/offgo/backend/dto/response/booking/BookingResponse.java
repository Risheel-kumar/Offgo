package com.offgo.backend.dto.response.booking;

import java.util.UUID;

import com.offgo.backend.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {

    private UUID id;

    private String employeeName;

    private String routeName;

    private String shuttleNumber;

    private Integer seatNumber;

    private BookingStatus status;

}