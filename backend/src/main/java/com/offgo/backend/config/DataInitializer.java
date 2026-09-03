package com.offgo.backend.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.offgo.backend.entity.Booking;
import com.offgo.backend.entity.Driver;
import com.offgo.backend.entity.Employee;
import com.offgo.backend.entity.Route;
import com.offgo.backend.entity.RouteStop;
import com.offgo.backend.entity.Schedule;
import com.offgo.backend.entity.Shuttle;
import com.offgo.backend.entity.Stop;
import com.offgo.backend.entity.User;
import com.offgo.backend.enums.BookingStatus;
import com.offgo.backend.enums.Department;
import com.offgo.backend.enums.DriverStatus;
import com.offgo.backend.enums.Role;
import com.offgo.backend.enums.RouteStatus;
import com.offgo.backend.enums.ScheduleStatus;
import com.offgo.backend.enums.ShuttleStatus;
import com.offgo.backend.enums.UserStatus;
import com.offgo.backend.enums.VehicleType;
import com.offgo.backend.repository.BookingRepository;
import com.offgo.backend.repository.DriverRepository;
import com.offgo.backend.repository.EmployeeRepository;
import com.offgo.backend.repository.RouteRepository;
import com.offgo.backend.repository.RouteStopRepository;
import com.offgo.backend.repository.ScheduleRepository;
import com.offgo.backend.repository.ShuttleRepository;
import com.offgo.backend.repository.StopRepository;
import com.offgo.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ShuttleRepository shuttleRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;
    private final RouteStopRepository routeStopRepository;
    private final StopRepository stopRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedEmployees();
        seedShuttles();
        seedDrivers();
        seedRoutes();
        seedStops();
        seedRouteStops();
        seedSchedules();
        synchronizeShuttleAssignments();
        seedBookings();
    }

    private void synchronizeShuttleAssignments() {
        for (Schedule schedule : scheduleRepository.findAll()) {
            Shuttle shuttle = schedule.getShuttle();
            Driver driver = schedule.getDriver();
            Route route = schedule.getRoute();

            if (shuttle == null) {
                continue;
            }

            if (shuttle.getRoute() == null && route != null) {
                shuttle.setRoute(route);
            }

            if (shuttle.getDriver() == null && driver != null && driver.getShuttle() == null) {
                driver.setShuttle(shuttle);
                driverRepository.save(driver);
            }

            shuttleRepository.save(shuttle);
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("alex.rivera@corp-offgo.com")) {
            userRepository.save(User.builder()
                    .firstName("Alex")
                    .lastName("Rivera")
                    .email("alex.rivera@corp-offgo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543210")
                    .employeeId("ADM-001")
                    .department("OPERATIONS")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .active(true)
                    .enabled(true)
                    .build());
        }

        if (!userRepository.existsByEmail("sarah.j@corp-offgo.com")) {
            userRepository.save(User.builder()
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .email("sarah.j@corp-offgo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543211")
                    .employeeId("EMP-9021")
                    .department("ENGINEERING")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .active(true)
                    .enabled(true)
                    .build());
        }

        if (!userRepository.existsByEmail("m.vance@corp-offgo.com")) {
            userRepository.save(User.builder()
                    .firstName("Marcus")
                    .lastName("Vance")
                    .email("m.vance@corp-offgo.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543212")
                    .employeeId("DRV-1001")
                    .department("OPERATIONS")
                    .role(Role.DRIVER)
                    .status(UserStatus.ACTIVE)
                    .active(true)
                    .enabled(true)
                    .build());
        }

        if (!userRepository.existsByEmail("shirathreddyg@gmail.com")) {
            userRepository.save(User.builder()
                    .firstName("Shirath")
                    .lastName("Reddy")
                    .email("shirathreddyg@gmail.com")
                    .password(passwordEncoder.encode("John@123"))
                    .phoneNumber("9876543299")
                    .employeeId("EMP-7788")
                    .department("ENGINEERING")
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .active(true)
                    .enabled(true)
                    .build());
            log.info("Permanent user seeded: shirathreddyg@gmail.com / John@123");
        }
    }

    private void seedEmployees() {
        if (employeeRepository.count() == 0) {
            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9021")
                    .firstName("Sarah")
                    .lastName("Jenkins")
                    .email("sarah.jenkins@company.com")
                    .phoneNumber("9876543211")
                    .department(Department.ENGINEERING)
                    .active(true)
                    .build());

            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9022")
                    .firstName("David")
                    .lastName("Chen")
                    .email("david.chen@company.com")
                    .phoneNumber("9876543222")
                    .department(Department.SUPPORT)
                    .active(true)
                    .build());

            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9023")
                    .firstName("Aaliyah")
                    .lastName("Patel")
                    .email("aaliyah.patel@company.com")
                    .phoneNumber("9876543233")
                    .department(Department.HR)
                    .active(true)
                    .build());

            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9024")
                    .firstName("Marcus")
                    .lastName("Vance")
                    .email("marcus.vance@company.com")
                    .phoneNumber("9876543244")
                    .department(Department.FINANCE)
                    .active(true)
                    .build());

            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9025")
                    .firstName("Elena")
                    .lastName("Rostova")
                    .email("elena.rostova@company.com")
                    .phoneNumber("9876543255")
                    .department(Department.OPERATIONS)
                    .active(true)
                    .build());

            employeeRepository.save(Employee.builder()
                    .employeeCode("EMP-9026")
                    .firstName("James")
                    .lastName("Wilson")
                    .email("james.wilson@company.com")
                    .phoneNumber("9876543266")
                    .department(Department.SALES)
                    .active(false)
                    .build());
            log.info("Seeded 6 sample Employees into database");
        }
    }

    private void seedShuttles() {
        if (shuttleRepository.count() <= 1) {
            shuttleRepository.save(Shuttle.builder()
                    .vehicleNumber("OFF-GO-104")
                    .vehicleName("Ford E-Transit Custom")
                    .vehicleType(VehicleType.VAN)
                    .capacity(14)
                    .availableSeats(14)
                    .status(ShuttleStatus.ACTIVE)
                    .active(true)
                    .build());

            shuttleRepository.save(Shuttle.builder()
                    .vehicleNumber("OFF-GO-108")
                    .vehicleName("Volvo 9700 Luxury Coach")
                    .vehicleType(VehicleType.BUS)
                    .capacity(32)
                    .availableSeats(32)
                    .status(ShuttleStatus.ACTIVE)
                    .active(true)
                    .build());

            shuttleRepository.save(Shuttle.builder()
                    .vehicleNumber("OFF-GO-112")
                    .vehicleName("Mercedes Sprinter VIP 2500")
                    .vehicleType(VehicleType.VAN)
                    .capacity(18)
                    .availableSeats(18)
                    .status(ShuttleStatus.ACTIVE)
                    .active(true)
                    .build());
            log.info("Seeded fleet shuttles into database");
        }
    }

    private void seedDrivers() {
        if (driverRepository.count() == 0) {
            driverRepository.save(Driver.builder()
                    .employeeId("DRV-1001")
                    .firstName("Marcus")
                    .lastName("Vance")
                    .email("marcus.vance@offgo.fleet.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543212")
                    .licenseNumber("CDL-SF-889123")
                    .licenseExpiry(LocalDate.now().plusYears(2))
                    .experience(8)
                    .status(DriverStatus.ASSIGNED)
                    .active(true)
                    .build());

            driverRepository.save(Driver.builder()
                    .employeeId("DRV-1002")
                    .firstName("David")
                    .lastName("Miller")
                    .email("david.miller@offgo.fleet.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543213")
                    .licenseNumber("CDL-SF-991204")
                    .licenseExpiry(LocalDate.now().plusYears(3))
                    .experience(6)
                    .status(DriverStatus.ASSIGNED)
                    .active(true)
                    .build());

            driverRepository.save(Driver.builder()
                    .employeeId("DRV-1003")
                    .firstName("Elena")
                    .lastName("Rostova")
                    .email("elena.rostova@offgo.fleet.com")
                    .password(passwordEncoder.encode("password123"))
                    .phoneNumber("9876543214")
                    .licenseNumber("CDL-SF-334109")
                    .licenseExpiry(LocalDate.now().plusYears(1))
                    .experience(5)
                    .status(DriverStatus.AVAILABLE)
                    .active(true)
                    .build());
            log.info("Seeded drivers into database");
        }
    }

    private void seedRoutes() {
        if (routeRepository.count() == 0) {
            routeRepository.save(Route.builder()
                    .routeCode("RT-EX-01")
                    .routeName("HQ Financial District Express Line A")
                    .source("Financial District Terminal")
                    .destination("Off-Go Innovation HQ")
                    .distanceKm(new BigDecimal("12.5"))
                    .estimatedDurationMinutes(35)
                    .status(RouteStatus.ACTIVE)
                    .active(true)
                    .build());

            routeRepository.save(Route.builder()
                    .routeCode("RT-NO-02")
                    .routeName("North Tech Corridor B")
                    .source("Marina Green Transit Hub")
                    .destination("Silicon Gateway Center")
                    .distanceKm(new BigDecimal("18.2"))
                    .estimatedDurationMinutes(42)
                    .status(RouteStatus.ACTIVE)
                    .active(true)
                    .build());

            routeRepository.save(Route.builder()
                    .routeCode("RT-SO-03")
                    .routeName("Metro South Loop C")
                    .source("Mission Bay Station")
                    .destination("SFO Airport Logistics Terminal")
                    .distanceKm(new BigDecimal("22.0"))
                    .estimatedDurationMinutes(48)
                    .status(RouteStatus.ACTIVE)
                    .active(true)
                    .build());
            log.info("Seeded routes into database");
        }
    }

    private void seedStops() {
        if (stopRepository.count() == 0) {
            stopRepository.save(Stop.builder()
                    .stopCode("STP-SF-101")
                    .stopName("Financial District Terminal")
                    .address("Market St & 1st St, San Francisco, CA 94105")
                    .landmark("Salesforce Transit Center Gate 4")
                    .latitude(37.7905)
                    .longitude(-122.398)
                    .active(true)
                    .build());

            stopRepository.save(Stop.builder()
                    .stopCode("STP-SF-102")
                    .stopName("Montgomery BART Transit Gate")
                    .address("599 Market St, San Francisco, CA 94105")
                    .landmark("Palace Hotel Entrance / BART Plaza")
                    .latitude(37.7890)
                    .longitude(-122.401)
                    .active(true)
                    .build());

            stopRepository.save(Stop.builder()
                    .stopCode("STP-SF-103")
                    .stopName("SOMA Tech Plaza Stop")
                    .address("3rd St & Folsom St, San Francisco, CA 94107")
                    .landmark("Moscone Center South Gate")
                    .latitude(37.7840)
                    .longitude(-122.399)
                    .active(true)
                    .build());
            log.info("Seeded stops into database");
        }
    }

    private void seedRouteStops() {
        if (routeStopRepository.count() > 0) {
            return;
        }

        var expressRoute = routeRepository.findByRouteCode("RT-EX-01");
        if (expressRoute.isPresent()) {
            assignStops(expressRoute.get(), "STP-SF-101", "STP-SF-102", "STP-SF-103");
        }
    }

    private void seedSchedules() {
        if (scheduleRepository.count() > 0) {
            return;
        }

        List<Route> routes = routeRepository.findAll();
        List<Driver> drivers = driverRepository.findAll();
        List<Shuttle> shuttles = shuttleRepository.findAll();

        if (routes.isEmpty() || drivers.isEmpty() || shuttles.isEmpty()) {
            return;
        }

        for (int index = 0; index < Math.min(routes.size(), 3); index++) {
            Route route = routes.get(index);
            Driver driver = drivers.get(index % drivers.size());
            Shuttle shuttle = shuttles.get(index % shuttles.size());

            scheduleRepository.save(Schedule.builder()
                    .route(route)
                    .driver(driver)
                    .shuttle(shuttle)
                    .departureTime(LocalTime.of(7 + index, 30))
                    .arrivalTime(LocalTime.of(8 + index, 10))
                    .startDate(LocalDate.now())
                    .endDate(LocalDate.now().plusDays(30))
                    .status(ScheduleStatus.ACTIVE)
                    .active(true)
                    .build());
        }

        log.info("Seeded schedules into database");
    }

    private void seedBookings() {
        if (bookingRepository.count() > 0) {
            return;
        }

        List<Employee> employees = employeeRepository.findAll();
        List<Schedule> schedules = scheduleRepository.findAll();

        if (employees.isEmpty() || schedules.isEmpty()) {
            return;
        }

        for (int index = 0; index < Math.min(employees.size(), schedules.size()); index++) {
            Employee employee = employees.get(index);
            Schedule schedule = schedules.get(index);

            bookingRepository.save(Booking.builder()
                    .employee(employee)
                    .schedule(schedule)
                    .seatNumber(index + 1)
                    .status(index % 2 == 0 ? BookingStatus.APPROVED : BookingStatus.PENDING)
                    .qrToken("QR-" + UUID.randomUUID())
                    .qrGeneratedAt(java.time.LocalDateTime.now())
                    .qrUsed(false)
                    .build());
        }

        log.info("Seeded sample bookings into database");
    }

    private void assignStops(Route route, String... stopCodes) {
        for (int index = 0; index < stopCodes.length; index++) {
            final int stopOrder = index + 1;
            stopRepository.findByStopCode(stopCodes[index]).ifPresent(stop -> routeStopRepository.save(RouteStop.builder()
                    .route(route)
                    .stop(stop)
                    .stopOrder(stopOrder)
                    .estimatedArrivalOffsetMinutes((stopOrder - 1) * 8)
                    .build()));
        }
    }
}
