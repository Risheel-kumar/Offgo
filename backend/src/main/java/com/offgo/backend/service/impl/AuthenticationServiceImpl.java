// package com.offgo.backend.service.impl;

// import org.springframework.stereotype.Service;

// import com.offgo.backend.dto.request.auth.RegisterRequest;
// import com.offgo.backend.dto.response.ApiResponse;
// import com.offgo.backend.service.auth.AuthenticationService;

// @Service
// public class AuthenticationServiceImpl implements AuthenticationService {

//     @Override
//     public ApiResponse<String> register(RegisterRequest request) {

//         return ApiResponse.<String>builder()
//                 .success(true)
//                 .message("Registration API Working")
//                 .data("Success")
//                 .build();
//     }
// }

package com.offgo.backend.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.auth.LoginRequest;
import com.offgo.backend.dto.request.auth.RegisterRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.auth.LoginResponse;
import com.offgo.backend.entity.User;
import com.offgo.backend.enums.Role;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.UserRepository;
import com.offgo.backend.security.jwt.JwtService;
import com.offgo.backend.service.auth.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

        private final UserRepository userRepository;

        private final PasswordEncoder passwordEncoder;

        private final AuthenticationManager authenticationManager;

        private final JwtService jwtService;
    @Override
    public ApiResponse<String> register(RegisterRequest request) {
        log.info("Registering user");
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered.");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number is already registered.");
        }

       User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .phoneNumber(request.getPhoneNumber())
        .role(Role.EMPLOYEE)
        .build();

        User savedUser = userRepository.save(user);
        log.info("User registered");
        return ApiResponse.<String>builder()
                .success(true)
                .message("User Saved Successfully")
                .data("User ID: " + savedUser.getId())
                .build();
    }

    @Override
    public ApiResponse<LoginResponse> login(LoginRequest request) {
        log.info("Login request received");
        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );
        String token = jwtService.generateToken(request.getEmail());

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();
        log.info("User authenticated");
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .id(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .authenticated(true)
                .build();
        log.info("JWT generated");
        return ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login Successful")
                .data(response)
                .build();

    }
}