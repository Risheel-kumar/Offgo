package com.offgo.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.offgo.backend.entity.User;
import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import com.offgo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "alex.rivera@corp-offgo.com";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return;
        }

        userRepository.save(User.builder()
                .firstName("Alex")
                .lastName("Rivera")
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode("password123"))
                .phoneNumber("9876543210")
                .employeeId("ADM-001")
                .department("OPERATIONS")
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .active(true)
                .enabled(true)
                .build());
    }
}