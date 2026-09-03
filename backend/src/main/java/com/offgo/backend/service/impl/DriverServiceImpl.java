package com.offgo.backend.service.impl;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import com.offgo.backend.enums.ScheduleStatus;

import org.springframework.stereotype.Service;

import com.offgo.backend.dto.request.driver.CreateDriverRequest;
import com.offgo.backend.dto.response.ApiResponse;
import com.offgo.backend.dto.response.driver.DriverResponse;
import com.offgo.backend.entity.Driver;
import com.offgo.backend.exception.ResourceNotFoundException;
import com.offgo.backend.mapper.DriverMapper;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.UserRepository;
import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.UserStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.offgo.backend.exception.BadRequestException;
import com.offgo.backend.exception.DuplicateResourceException;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.service.driver.DriverService;
import com.offgo.backend.validator.DriverValidator;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final DriverValidator driverValidator;
        private final ShuttleRepository shuttleRepository;
        private final ScheduleRepository scheduleRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

    @Override
    public ApiResponse<DriverResponse> createDriver(
            CreateDriverRequest request) {

        driverValidator.validateCreate(request);
                if (request.getPassword() == null || request.getPassword().length() < 8 ||
                                !request.getPassword().equals(request.getConfirmPassword())) {
                        throw new IllegalArgumentException("Passwords do not match.");
                }
                if (userRepository.existsByEmail(request.getEmail()) ||
                                userRepository.existsByPhoneNumber(request.getPhoneNumber()) ||
                                userRepository.existsByEmployeeId(request.getEmployeeId())) {
                        throw new DuplicateResourceException("A login account already exists for this driver.");
                }
        log.info("Creating driver {}", request.getEmployeeId());
        Driver driver = driverMapper.toEntity(request);
        driver.setPassword(passwordEncoder.encode(request.getPassword()));

        Driver savedDriver = driverRepository.save(driver);
        userRepository.save(com.offgo.backend.entity.User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .employeeId(request.getEmployeeId())
                .department("OPERATIONS")
                .password(savedDriver.getPassword())
                .role(Role.DRIVER)
                .status(UserStatus.ACTIVE)
                .enabled(true)
                .active(true)
                .build());
        log.info("Driver saved {}", savedDriver.getId());
        return ApiResponse.<DriverResponse>builder()
                .success(true)
                .message("Driver created successfully")
                .data(driverMapper.toResponse(savedDriver))
                .build();
    }

    @Override
    public ApiResponse<List<DriverResponse>> getAllDrivers() {
        log.info("Fetching all drivers");
        List<DriverResponse> drivers = driverRepository.findAll()
                .stream()
                .filter(Driver::isActive)
                .map(driverMapper::toResponse)
                .toList();

        return ApiResponse.<List<DriverResponse>>builder()
                .success(true)
                .message("Drivers fetched successfully")
                .data(drivers)
                .build();
    }

    @Override
    public ApiResponse<DriverResponse> getDriverById(UUID id) {
        log.info("Fetching driver {}", id);
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Driver not found."));

        return ApiResponse.<DriverResponse>builder()
                .success(true)
                .message("Driver fetched successfully")
                .data(driverMapper.toResponse(driver))
                .build();
    }

    @Override
    public ApiResponse<DriverResponse> updateDriver(UUID id, CreateDriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        driver.setEmployeeId(request.getEmployeeId());
        driver.setFirstName(request.getFirstName());
        driver.setLastName(request.getLastName());
        driver.setEmail(request.getEmail());
        driver.setPhoneNumber(request.getPhoneNumber());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseExpiry(request.getLicenseExpiry());
        driver.setExperience(request.getExperience());
        return ApiResponse.<DriverResponse>builder().success(true).message("Driver updated successfully")
                .data(driverMapper.toResponse(driverRepository.save(driver))).build();
    }

    @Override
    public ApiResponse<DriverResponse> assignShuttle(UUID id, UUID shuttleId) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        Shuttle shuttle = shuttleId == null ? null : shuttleRepository.findById(shuttleId)
                .orElseThrow(() -> new ResourceNotFoundException("Shuttle not found"));
                if (shuttle != null) {
                        driverRepository.findByShuttleId(shuttle.getId()).ifPresent(previousDriver -> {
                                if (!previousDriver.getId().equals(driver.getId())) {
                                        previousDriver.setShuttle(null);
                                        driverRepository.save(previousDriver);
                                }
                        });
                }
        driver.setShuttle(shuttle);
        if (shuttle != null) {
                shuttle.setTrackingEnabled(false);
                shuttle.setStatus(com.offgo.backend.enums.ShuttleStatus.INACTIVE);
                shuttleRepository.save(shuttle);
        }
        return ApiResponse.<DriverResponse>builder().success(true).message("Shuttle assignment updated")
                .data(driverMapper.toResponse(driverRepository.save(driver))).build();
    }

        @Override
        public ApiResponse<DriverResponse> startNavigation(UUID id) {
                Driver driver = driverRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
                if (driver.getShuttle() == null) throw new BadRequestException("No shuttle is assigned to this driver.");
                boolean hasSchedule = scheduleRepository.findByDriverId(id).stream()
                                .anyMatch(schedule -> schedule.isActive() && schedule.getStatus() == ScheduleStatus.ACTIVE
                                                && !schedule.getStartDate().isAfter(LocalDate.now()) && !schedule.getEndDate().isBefore(LocalDate.now()));
                if (!hasSchedule) throw new BadRequestException("No active schedule is assigned to this driver today.");
                driver.getShuttle().setStatus(com.offgo.backend.enums.ShuttleStatus.ACTIVE);
                driver.getShuttle().setTrackingEnabled(true);
                shuttleRepository.save(driver.getShuttle());
                return ApiResponse.<DriverResponse>builder().success(true).message("Navigation started").data(driverMapper.toResponse(driver)).build();
        }

        @Override
        public ApiResponse<DriverResponse> stopNavigation(UUID id) {
                Driver driver = driverRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
                if (driver.getShuttle() != null) {
                        driver.getShuttle().setTrackingEnabled(false);
                        driver.getShuttle().setStatus(com.offgo.backend.enums.ShuttleStatus.INACTIVE);
                        shuttleRepository.save(driver.getShuttle());
                }
                return ApiResponse.<DriverResponse>builder().success(true).message("Navigation stopped").data(driverMapper.toResponse(driver)).build();
        }

    @Override
    public void deleteDriver(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
                if (!scheduleRepository.findByDriverId(id).isEmpty()) {
                        throw new BadRequestException("Driver cannot be deleted while assigned to a schedule.");
                }
                driver.setShuttle(null);
                driverRepository.delete(driver);
    }

}
