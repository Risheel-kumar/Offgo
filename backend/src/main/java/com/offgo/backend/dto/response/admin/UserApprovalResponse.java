package com.offgo.backend.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserApprovalResponse {
    private String id;
    private String userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String department;
    private String employeeIdOrDriverId;
    private String registrationDate;
    private String status;
    private String reviewedBy;
    private String reviewedAt;
    private String rejectionReason;
}
