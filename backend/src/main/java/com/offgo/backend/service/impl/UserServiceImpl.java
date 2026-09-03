package com.offgo.backend.service.impl;

import com.offgo.backend.dto.request.user.ChangePasswordRequest;
import com.offgo.backend.dto.request.user.UpdateUserProfileRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.user.UserProfileResponse;
import com.offgo.backend.entity.User;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.UserRepository;
import com.offgo.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ApiResponse<UserProfileResponse> getMyProfile() {
        User user = getCurrentUser();

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(toProfileResponse(user))
                .build();
    }

    @Override
    public ApiResponse<UserProfileResponse> updateMyProfile(UpdateUserProfileRequest request) {
        User user = getCurrentUser();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDepartment(request.getDepartment());
        user.setEmployeeId(request.getEmployeeId());

        User updatedUser = userRepository.save(user);

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(toProfileResponse(updatedUser))
                .build();
    }

    @Override
    public ApiResponse<String> changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Password changed successfully")
                .data("Password updated")
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .phoneNumber(user.getPhoneNumber())
                .department(user.getDepartment())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
