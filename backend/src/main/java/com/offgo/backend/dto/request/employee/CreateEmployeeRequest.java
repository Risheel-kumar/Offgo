package com.offgo.backend.dto.request.employee;

import com.offgo.backend.enums.Department;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateEmployeeRequest {

    @NotBlank
    private String employeeCode;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phoneNumber;

    @NotNull
    private Department department;

}