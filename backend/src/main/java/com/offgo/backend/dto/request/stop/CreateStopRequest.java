package com.offgo.backend.dto.request.stop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateStopRequest {

    @NotBlank
    private String stopCode;

    @NotBlank
    private String stopName;

    @NotBlank
    private String address;

    private String landmark;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

}