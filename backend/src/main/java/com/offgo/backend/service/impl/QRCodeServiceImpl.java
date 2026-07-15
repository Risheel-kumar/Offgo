package com.offgo.backend.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.offgo.backend.dto.request.qr.VerifyQRRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.qr.QRVerificationResponse;
import com.offgo.backend.entity.Attendance;
import com.offgo.backend.entity.Booking;
import com.offgo.backend.enums.AttendanceStatus;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.repository.AttendanceRepository;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.service.qr.QRCodeService;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
@Slf4j
@Service
@RequiredArgsConstructor
public class QRCodeServiceImpl implements QRCodeService {

    private final BookingRepository bookingRepository;

    private final AttendanceRepository attendanceRepository;

    @Override
    public byte[] generateQRCode(
            String text,
            int width,
            int height) {

        try {
        log.info(
        "Generating QR");
            QRCodeWriter writer = new QRCodeWriter();

            BitMatrix matrix = writer.encode(
                    text,
                    BarcodeFormat.QR_CODE,
                    width,
                    height);

            ByteArrayOutputStream stream = new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    matrix,
                    "PNG",
                    stream);
                log.info(
        "QR generated");
            return stream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException("Failed to generate QR Code", e);

        }
    }

    @Override
    public ApiResponse<QRVerificationResponse> verifyQRCode(
            VerifyQRRequest request) {
        log.info(
        "Verifying QR Code");
        Booking booking = bookingRepository
                .findByQrToken(request.getQrToken())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid QR Code"));

        if (Boolean.TRUE.equals(booking.getQrUsed())) {
            throw new BadRequestException("QR Code already used");
        }

        Attendance attendance = attendanceRepository
                .findByBookingId(booking.getId())
                .orElse(
                        Attendance.builder()
                                .booking(booking)
                                .build());

        attendance.setStatus(AttendanceStatus.CHECKED_IN);
        attendance.setCheckInTime(LocalDateTime.now());

        attendanceRepository.save(attendance);

        booking.setQrUsed(true);
        bookingRepository.save(booking);

        QRVerificationResponse response = QRVerificationResponse.builder()
                .employeeName(
                        booking.getEmployee().getFirstName()
                                + " "
                                + booking.getEmployee().getLastName())
                .route(
                        booking.getSchedule()
                                .getRoute()
                                .getRouteName())
                .shuttle(
                        booking.getSchedule()
                                .getShuttle()
                                .getVehicleNumber())
                .seatNumber(booking.getSeatNumber())
                .verified(true)
                .message("Attendance Marked")
                .build();

        return ApiResponse.<QRVerificationResponse>builder()
                .success(true)
                .message("QR Verified Successfully")
                .data(response)
                .build();
    }
}