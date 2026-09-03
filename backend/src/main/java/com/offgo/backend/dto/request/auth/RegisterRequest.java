package com.offgo.backend.dto.request.auth;

import com.offgo.backend.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotBlank
    private String employeeId;

    @NotBlank
    private String department;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Invalid phone number"
    )
    private String phoneNumber;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotBlank
    private String confirmPassword;

    private Role role;
}