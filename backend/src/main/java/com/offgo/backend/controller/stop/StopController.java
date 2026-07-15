package com.offgo.backend.controller.stop;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.stop.CreateStopRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.stop.StopResponse;
import com.offgo.backend.service.stop.StopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/stops")
public class StopController {

    private final StopService stopService;

    @PostMapping
    public ResponseEntity<ApiResponse<StopResponse>> createStop(
            @Valid @RequestBody CreateStopRequest request) {

        return ResponseEntity.ok(
                stopService.createStop(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StopResponse>>> getAllStops() {

        return ResponseEntity.ok(
                stopService.getAllStops());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StopResponse>> getStopById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                stopService.getStopById(id));
    }

}