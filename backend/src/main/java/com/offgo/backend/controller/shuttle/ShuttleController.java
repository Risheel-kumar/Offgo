package com.offgo.backend.controller.shuttle;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.request.shuttle.CreateShuttleRequest;
import com.offgo.backend.dto.request.shuttle.UpdateShuttleRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.shuttle.ShuttleResponse;
import com.offgo.backend.service.shuttle.ShuttleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/shuttles")
public class ShuttleController {

    private final ShuttleService shuttleService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShuttleResponse>> createShuttle(
            @Valid @RequestBody CreateShuttleRequest request) {

        return ResponseEntity.ok(
                shuttleService.createShuttle(request));

    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<ShuttleResponse>>> getAllShuttles() {

        return ResponseEntity.ok(
                shuttleService.getAllShuttles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShuttleResponse>> getShuttleById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                shuttleService.getShuttleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShuttleResponse>> updateShuttle(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateShuttleRequest request) {

        return ResponseEntity.ok(
                shuttleService.updateShuttle(id, request));

    }
}