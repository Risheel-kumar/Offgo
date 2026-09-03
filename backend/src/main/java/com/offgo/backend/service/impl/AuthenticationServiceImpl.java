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

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.auth.LoginRequest;
import com.offgo.backend.dto.request.auth.RegisterRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.auth.LoginResponse;
import com.offgo.backend.entity.User;
import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.repository.UserRepository;
import com.offgo.backend.security.jwt.JwtService;
import com.offgo.backend.service.auth.AuthenticationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID is already registered.");
        }

        Role requestedRole = request.getRole();
                        if (requestedRole == null) {
                        requestedRole = Role.EMPLOYEE;
                        }
                        if (requestedRole != Role.EMPLOYEE &&
                        requestedRole != Role.DRIVER) {
                        throw new IllegalArgumentException(
                                "Only Employee and Driver registration is allowed."
                        );
        }

       User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .employeeId(request.getEmployeeId())
        .department(request.getDepartment())
        .email(request.getEmail())
        .phoneNumber(request.getPhoneNumber())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(requestedRole)
        .status(UserStatus.PENDING)
        .active(false)
        .enabled(false)
        .build();
        if (!request.getPassword().equals(request.getConfirmPassword())) {

                throw new IllegalArgumentException(
            "Passwords do not match.");

        }
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
                User existingUser = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

                if (existingUser.getStatus() == UserStatus.PENDING) {
                        throw new IllegalStateException("Your account is pending administrator approval.");
                }
                if (existingUser.getStatus() == UserStatus.REJECTED) {
                        throw new IllegalStateException("Your account has been rejected.");
                }

        authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        ));
        String token = jwtService.generateToken(request.getEmail());

        User user = existingUser;
                if (user.getStatus() == UserStatus.REJECTED) {
                throw new IllegalStateException(
                        "Your account has been rejected.");
                }

                if (user.getStatus() == UserStatus.BLOCKED) {
                throw new IllegalStateException(
                        "Your account has been blocked.");
                }

                user.setLastLogin(LocalDateTime.now());

                userRepository.save(user);
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .id(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .department(user.getDepartment())
                .phone(user.getPhoneNumber())
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