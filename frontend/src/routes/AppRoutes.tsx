import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';

// Layouts
import { AdminLayout } from '../layouts/AdminLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import { DriverLayout } from '../layouts/DriverLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PublicLayout } from '../layouts/PublicLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Admin Pages
import { FleetLiveTrackingPage } from '../pages/admin/FleetLiveTrackingPage';
import { UserApprovalsPage } from '../pages/admin/UserApprovalsPage';
import { RoutesOverviewPage } from '../pages/admin/RoutesOverviewPage';
import { ShuttleManagementPage } from '../pages/admin/ShuttleManagementPage';
import { BookingPage } from '../pages/admin/BookingPage';
import { ScheduleManagementPage } from '../pages/admin/ScheduleManagementPage';
import { EmployeePage } from '../pages/employees/EmployeePage';
import { DriverManagementPage } from '../pages/admin/DriverManagementPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { AdminExpensesPage } from '../pages/admin/AdminExpensesPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';

// Employee Pages
import { EmployeeDashboardPage } from '../pages/employee/EmployeeDashboardPage';
import { EmployeeBookingPage } from '../pages/employee/EmployeeBookingPage';
import { EmployeePassPage } from '../pages/employee/EmployeePassPage';
import { EmployeeExpensesPage } from '../pages/employee/EmployeeExpensesPage';
import { EmployeeTrackPage } from '../pages/employee/EmployeeTrackPage';
import { EmployeePickupMapPage } from '../pages/employee/EmployeePickupMapPage';

// Driver Pages
import { DriverDashboardPage } from '../pages/driver/DriverDashboardPage';
import { DriverNavigationPage } from '../pages/driver/DriverNavigationPage';
import { DriverCheckinPage } from '../pages/driver/DriverCheckinPage';

// Error Pages
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { UnauthorizedPage } from '../pages/error/UnauthorizedPage';

import { ComplaintPage } from '../components/complaints/ComplaintPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Admin Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['ADMIN', 'FLEET_MANAGER']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<FleetLiveTrackingPage />} />
            <Route path="/admin/live-tracking" element={<FleetLiveTrackingPage />} />
            <Route path="/admin/approvals" element={<UserApprovalsPage />} />
            <Route path="/admin/routes" element={<RoutesOverviewPage />} />
            <Route path="/admin/shuttles" element={<ShuttleManagementPage />} />
            <Route path="/admin/drivers" element={<DriverManagementPage />} />
            <Route path="/admin/schedules" element={<ScheduleManagementPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/employees" element={<EmployeePage />} />
            <Route path="/admin/expenses" element={<AdminExpensesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/complaints" element={<ComplaintPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Employee Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['EMPLOYEE', 'ADMIN']} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/employee/booking" element={<EmployeeBookingPage />} />
            <Route path="/employee/pickup-map" element={<EmployeePickupMapPage />} />
            <Route path="/employee/pass" element={<EmployeePassPage />} />
            <Route path="/employee/expenses" element={<EmployeeExpensesPage />} />
            <Route path="/employee/complaints" element={<ComplaintPage />} />
            <Route path="/employee/track" element={<EmployeeTrackPage />} />
          </Route>
        </Route>

        {/* Driver Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['DRIVER', 'ADMIN']} />}>
          <Route element={<DriverLayout />}>
            <Route path="/driver/dashboard" element={<DriverDashboardPage />} />
            <Route path="/driver/navigation" element={<DriverNavigationPage />} />
            <Route path="/driver/checkin" element={<DriverCheckinPage />} />
            <Route path="/driver/complaints" element={<ComplaintPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
