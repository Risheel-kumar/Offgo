package com.offgo.backend.service.schedule;

import java.util.List;
import java.util.UUID;

import com.offgo.backend.dto.request.schedule.CreateScheduleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.schedule.ScheduleResponse;

public interface ScheduleService {

    ApiResponse<ScheduleResponse> createSchedule(
            CreateScheduleRequest request);

    ApiResponse<List<ScheduleResponse>> getAllSchedules();

    ApiResponse<ScheduleResponse> getScheduleById(
            UUID id);

}