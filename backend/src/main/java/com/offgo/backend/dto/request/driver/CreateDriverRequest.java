package com.offgo.backend.dto.request.driver;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateDriverRequest {

    @NotBlank
    private String employeeId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String licenseNumber;

    @NotNull
    @Future
    private LocalDate licenseExpiry;

    @Min(0)
    private Integer experience;

    @Size(min = 8)
    private String password;

    private String confirmPassword;

}