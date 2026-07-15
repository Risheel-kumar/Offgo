package com.offgo.backend.dto.response.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeDashboardResponse {

    private String employeeName;

    private String currentBooking;

    private String shuttleNumber;

    private String routeName;

    private String qrCodeUrl;

    private Integer etaMinutes;

}