package com.offgo.backend.dto.request.qr;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyQRRequest {

    @NotBlank
    private String qrToken;

}