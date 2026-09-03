import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/buttons/Button';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRouteByRole } from '../../utils/helpers';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const dashboardRoute = getDashboardRouteByRole(user?.role);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="p-5 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">403</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Access Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your current user role lacks elevated clearance to access this corporate shuttle module.
        </p>
      </div>
      <Link to={dashboardRoute}>
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Authorized Portal
        </Button>
      </Link>
    </div>
  );
};
