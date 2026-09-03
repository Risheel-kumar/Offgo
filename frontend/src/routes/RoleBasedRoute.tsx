import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { ROUTES } from '../constants/routes';

export interface RoleBasedRouteProps {
  allowedRoles: Role[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};
