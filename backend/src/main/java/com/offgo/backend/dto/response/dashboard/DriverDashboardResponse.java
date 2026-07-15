package com.offgo.backend.dto.response.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DriverDashboardResponse {

    private String driverName;

    private String shuttleNumber;

    private String routeName;

    private Integer completedTrips;

    private Integer todaysPassengers;

}