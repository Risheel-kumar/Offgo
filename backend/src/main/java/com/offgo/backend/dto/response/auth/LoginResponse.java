package com.offgo.backend.dto.response.auth;

import com.offgo.backend.enums.Role;

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

    private Role role;

    private boolean authenticated;

}