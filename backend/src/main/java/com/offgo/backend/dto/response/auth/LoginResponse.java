package com.offgo.backend.dto.response.auth;

import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String employeeId;

    private String department;

    private String phone;

    private UserStatus status;

    private Role role;

    private boolean authenticated;

}