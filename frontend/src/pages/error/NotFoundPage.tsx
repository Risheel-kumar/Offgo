import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../../components/common/buttons/Button';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRouteByRole } from '../../utils/helpers';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const dashboardRoute = getDashboardRouteByRole(user?.role);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="p-5 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        <Compass className="w-16 h-16 animate-spin" style={{ animationDuration: '20s' }} />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Shuttle Route Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested page or resource endpoint does not exist on the Off-Go platform.
        </p>
      </div>
      <Link to={dashboardRoute}>
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
