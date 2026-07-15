package com.offgo.backend.service.auth;

import com.offgo.backend.dto.request.auth.LoginRequest;
import com.offgo.backend.dto.request.auth.RegisterRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.auth.LoginResponse;
public interface AuthenticationService {

    ApiResponse<String> register(RegisterRequest request);

    ApiResponse<LoginResponse> login(LoginRequest request);

}