# Off-Go Backend Guide for Frontend Development

## 1. What this backend does
This is a Spring Boot backend for the Off-Go shuttle management system. It exposes REST APIs for:
- Authentication and user login/register
- Employee and driver management
- Shuttle, route, stop, and schedule management
- Booking and attendance
- Dashboard summaries
- Live shuttle tracking and WebSocket updates
- QR verification and notifications

## 2. Main entry points
- [backend/src/main/java/com/offgo/backend/BackendApplication.java](src/main/java/com/offgo/backend/BackendApplication.java): main Spring Boot class that starts the application.
- [backend/pom.xml](pom.xml): Maven build file and dependency list.
- [backend/src/main/resources/application.properties](src/main/resources/application.properties): database, JWT, Swagger, and server configuration.

## 3. API base and auth
The backend uses the base path `/api/v1`.

### Authentication
- [backend/src/main/java/com/offgo/backend/controller/auth/AuthenticationController.java](src/main/java/com/offgo/backend/controller/auth/AuthenticationController.java)
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`

### Security
- [backend/src/main/java/com/offgo/backend/security/config/SecurityConfig.java](src/main/java/com/offgo/backend/security/config/SecurityConfig.java)
  - Configures JWT authentication, CORS, and protected endpoints.
- [backend/src/main/java/com/offgo/backend/security/jwt/JwtAuthenticationFilter.java](src/main/java/com/offgo/backend/security/jwt/JwtAuthenticationFilter.java)
  - Reads the JWT from requests and authenticates the user.

### Frontend note
After login, the frontend should store the returned token and send it as:
`Authorization: Bearer <token>`

## 4. Main backend modules

### Auth and users
- [backend/src/main/java/com/offgo/backend/controller/auth/AuthenticationController.java](src/main/java/com/offgo/backend/controller/auth/AuthenticationController.java)
  - Handles register/login.
- [backend/src/main/java/com/offgo/backend/service/impl/AuthenticationServiceImpl.java](src/main/java/com/offgo/backend/service/impl/AuthenticationServiceImpl.java)
  - Implements auth logic and token handling.
- [backend/src/main/java/com/offgo/backend/entity/User.java](src/main/java/com/offgo/backend/entity/User.java)
  - User entity persisted in the database.

### Employees and drivers
- [backend/src/main/java/com/offgo/backend/controller/employee/EmployeeController.java](src/main/java/com/offgo/backend/controller/employee/EmployeeController.java)
  - Employee CRUD endpoints.
- [backend/src/main/java/com/offgo/backend/controller/driver/DriverController.java](src/main/java/com/offgo/backend/controller/driver/DriverController.java)
  - Driver CRUD endpoints.
- [backend/src/main/java/com/offgo/backend/entity/Employee.java](src/main/java/com/offgo/backend/entity/Employee.java)
- [backend/src/main/java/com/offgo/backend/entity/Driver.java](src/main/java/com/offgo/backend/entity/Driver.java)

### Shuttles, routes, stops, schedules
- [backend/src/main/java/com/offgo/backend/controller/shuttle/ShuttleController.java](src/main/java/com/offgo/backend/controller/shuttle/ShuttleController.java)
  - Shuttle create/list/get/update endpoints.
- [backend/src/main/java/com/offgo/backend/controller/route/RouteController.java](src/main/java/com/offgo/backend/controller/route/RouteController.java)
  - Route CRUD endpoints.
- [backend/src/main/java/com/offgo/backend/controller/route/RouteStopController.java](src/main/java/com/offgo/backend/controller/route/RouteStopController.java)
  - Assigns stops to routes.
- [backend/src/main/java/com/offgo/backend/controller/stop/StopController.java](src/main/java/com/offgo/backend/controller/stop/StopController.java)
  - Stop CRUD endpoints.
- [backend/src/main/java/com/offgo/backend/controller/schedule/ScheduleController.java](src/main/java/com/offgo/backend/controller/schedule/ScheduleController.java)
  - Schedule management.

### Bookings and attendance
- [backend/src/main/java/com/offgo/backend/controller/booking/BookingController.java](src/main/java/com/offgo/backend/controller/booking/BookingController.java)
  - Create, list, view, cancel bookings.
- [backend/src/main/java/com/offgo/backend/controller/attendance/AttendanceController.java](src/main/java/com/offgo/backend/controller/attendance/AttendanceController.java)
  - Check-in and attendance-related operations.

### Dashboard
- [backend/src/main/java/com/offgo/backend/controller/dashboard/DashboardController.java](src/main/java/com/offgo/backend/controller/dashboard/DashboardController.java)
  - Gives admin, employee, and driver dashboard data.

### Tracking and live location
- [backend/src/main/java/com/offgo/backend/controller/tracking/TrackingController.java](src/main/java/com/offgo/backend/controller/tracking/TrackingController.java)
  - Updates shuttle location, fetches live fleet locations, progress, history, and current stop.
- [backend/src/main/java/com/offgo/backend/service/impl/TrackingServiceImpl.java](src/main/java/com/offgo/backend/service/impl/TrackingServiceImpl.java)
  - Core logic for live tracking and route calculations.
- [backend/src/main/java/com/offgo/backend/config/WebSocketConfig.java](src/main/java/com/offgo/backend/config/WebSocketConfig.java)
  - Enables real-time WebSocket/STOMP updates.

### QR, ETA, notifications
- [backend/src/main/java/com/offgo/backend/controller/qr/QRCodeController.java](src/main/java/com/offgo/backend/controller/qr/QRCodeController.java)
  - QR verification flow.
- [backend/src/main/java/com/offgo/backend/controller/eta/ETAController.java](src/main/java/com/offgo/backend/controller/eta/ETAController.java)
  - ETA endpoint.
- [backend/src/main/java/com/offgo/backend/controller/notification/NotificationController.java](src/main/java/com/offgo/backend/controller/notification/NotificationController.java)
  - Notification retrieval.

## 5. Core data and response structure
- [backend/src/main/java/com/offgo/backend/entity](src/main/java/com/offgo/backend/entity): JPA entities such as `User`, `Shuttle`, `Route`, `Stop`, `Schedule`, `Booking`, `Attendance`, `Notification`.
- [backend/src/main/java/com/offgo/backend/repository](src/main/java/com/offgo/backend/repository): database access layer.
- [backend/src/main/java/com/offgo/backend/dto](src/main/java/com/offgo/backend/dto): request and response objects used by the frontend.
- [backend/src/main/java/com/offgo/backend/dto/response/ApiResponse.java](src/main/java/com/offgo/backend/dto/response/ApiResponse.java): common response format used by almost all endpoints.

Most API responses look like this:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "..."
}
```

## 6. Setup and run instructions

### Prerequisites
Before running the backend, make sure you have the following installed:
- Java 21 or newer
- Maven 3.8+ (or use the Maven wrapper in this folder)
- PostgreSQL installed and running locally
- A database named `offgo` created in PostgreSQL

### 1. Install Java and Maven
On Windows, verify installation with:
```bash
java -version
mvn -version
```
If Java is missing, install JDK 21 and make sure the `JAVA_HOME` environment variable is set correctly.

### 2. Create the database
Open PostgreSQL and create the database:
```sql
CREATE DATABASE offgo;
```
The connection settings are already defined in [backend/src/main/resources/application.properties](src/main/resources/application.properties).

### 3. Install backend dependencies
From the backend folder, run:
```bash
cd backend
./mvnw clean install
```
On Windows PowerShell, use:
```powershell
cd backend
mvnw.cmd clean install
```
This downloads all Maven dependencies and compiles the project.

### 4. Run the backend locally
Start the Spring Boot app with:
```bash
cd backend
./mvnw spring-boot:run
```
Or on Windows:
```powershell
cd backend
mvnw.cmd spring-boot:run
```

### 5. Verify the backend is running
Once started, the app should be available at:
- Main server: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API docs: `http://localhost:8080/api-docs`

### 6. Common useful commands
```bash
# Run tests
./mvnw test

# Clean build artifacts
./mvnw clean

# Run the app in the background
./mvnw spring-boot:run
```

### 7. Frontend integration tips
- Base URL: `http://localhost:8080`
- API prefix: `/api/v1`
- Authentication: login first, then send the JWT on follow-up requests
- For live tracking: connect to the WebSocket endpoint `/ws`
- Swagger UI is available at `/swagger-ui.html`

### 8. Troubleshooting
- If the app fails to start, check that PostgreSQL is running and the database `offgo` exists.
- If you see authentication errors, confirm the frontend sends the JWT in the `Authorization` header.
- If CORS errors occur, verify the allowed origin in [backend/src/main/java/com/offgo/backend/security/config/SecurityConfig.java](src/main/java/com/offgo/backend/security/config/SecurityConfig.java).
- If the frontend cannot connect, make sure the backend is running on port `8080` and that your frontend is calling the correct base URL.

## 9. Files that look unused or likely legacy
Based on current references in the codebase, these look unused or only for testing:
- [backend/src/main/java/com/offgo/backend/security/service/CustomUserDetailsService.java](src/main/java/com/offgo/backend/security/service/CustomUserDetailsService.java): empty class and not referenced by the active security flow.
- [backend/src/main/java/com/offgo/backend/controller/TestController.java](src/main/java/com/offgo/backend/controller/TestController.java): simple sample endpoint, not part of the main business flow.
- [backend/src/main/java/com/offgo/backend/dto/response/auth/AuthenticationResponse.java](src/main/java/com/offgo/backend/dto/response/auth/AuthenticationResponse.java): appears not to be used by the current controller/service code.
- [backend/src/test/java/com/offgo/backend/BackendApplicationTests.java](src/test/java/com/offgo/backend/BackendApplicationTests.java): test-only file.

The core production flow is still active and centered around the controllers, services, entities, and repositories listed above.
