package com.offgo.backend.dto.response.qr;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QRVerificationResponse {

    private String employeeName;

    private String shuttle;

    private String route;

    private Integer seatNumber;

    private boolean verified;

    private String message;

}