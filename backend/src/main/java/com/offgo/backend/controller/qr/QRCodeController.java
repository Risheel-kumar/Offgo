package com.offgo.backend.controller.qr;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.offgo.backend.dto.request.qr.VerifyQRRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.qr.QRVerificationResponse;
import com.offgo.backend.dto.request.qr.VerifyQRRequest;
import com.offgo.backend.dto.response.qr.QRVerificationResponse;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.service.qr.QRCodeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/qr")
public class QRCodeController {

    private final BookingRepository bookingRepository;

    private final QRCodeService qrCodeService;

    @GetMapping(value="/{bookingId}",
            produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> qr(
            @PathVariable String bookingId) {

        var booking =
                bookingRepository.findById(
                        java.util.UUID.fromString(bookingId))
                .orElseThrow();

        return ResponseEntity.ok(

                qrCodeService.generateQRCode(
                        booking.getQrToken(),
                        300,
                        300)

        );

    }
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<QRVerificationResponse>>
    verifyQRCode(
            @Valid
            @RequestBody
            VerifyQRRequest request) {

        return ResponseEntity.ok(
                qrCodeService.verifyQRCode(request));
    }

}