package com.offgo.backend.service.user;

import com.offgo.backend.dto.request.user.ChangePasswordRequest;
import com.offgo.backend.dto.request.user.UpdateUserProfileRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.user.UserProfileResponse;

public interface UserService {

    ApiResponse<UserProfileResponse> getMyProfile();

    ApiResponse<UserProfileResponse> updateMyProfile(UpdateUserProfileRequest request);

    ApiResponse<String> changePassword(ChangePasswordRequest request);

}