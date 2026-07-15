package com.offgo.backend.controller.schedule;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.schedule.CreateScheduleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.schedule.ScheduleResponse;
import com.offgo.backend.service.schedule.ScheduleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

   @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> create(
            @Valid @RequestBody CreateScheduleRequest request) {

        System.out.println("Create Schedule API Called");

        return ResponseEntity.ok(scheduleService.createSchedule(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAll() {

        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }
}