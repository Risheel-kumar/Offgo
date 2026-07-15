package com.offgo.backend.service.qr;

import com.offgo.backend.dto.request.qr.VerifyQRRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.qr.QRVerificationResponse;

public interface QRCodeService {

    byte[] generateQRCode(
            String text,
            int width,
            int height);

    ApiResponse<QRVerificationResponse> verifyQRCode(
            VerifyQRRequest request);

}