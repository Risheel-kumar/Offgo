package com.offgo.backend.dto.response.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {

    private String token;

    private String email;

    private String role;

    private String message;

}