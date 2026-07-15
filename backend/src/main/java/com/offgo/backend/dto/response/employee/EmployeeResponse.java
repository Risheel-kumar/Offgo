package com.offgo.backend.dto.response.employee;

import java.util.UUID;

import com.offgo.backend.enums.Department;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeResponse {

    private UUID id;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Department department;

    private boolean active;

}