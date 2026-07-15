package com.offgo.backend.controller.eta;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.offgo.backend.constants.AppConstants;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.tracking.ETAResponse;
import com.offgo.backend.service.eta.ETAService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.API_BASE + "/eta")
public class ETAController {

    private final ETAService etaService;

    @GetMapping("/{shuttleId}")
    public ResponseEntity<ApiResponse<ETAResponse>> getETA(
            @PathVariable UUID shuttleId) {

        return ResponseEntity.ok(
                etaService.calculateETA(shuttleId));
    }
}