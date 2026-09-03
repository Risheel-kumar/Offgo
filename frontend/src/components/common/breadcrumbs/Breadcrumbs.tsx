import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { formatStatusLabel } from '../../../utils/formatters';
import { useAuth } from '../../../context/AuthContext';
import { getDashboardRouteByRole } from '../../../utils/helpers';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();
  const { user } = useAuth();
  const homeRoute = getDashboardRouteByRole(user?.role);

  const generateFromPath = (): BreadcrumbItem[] => {
    const segments = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    let currentPath = '';
    segments.forEach((seg, idx) => {
      currentPath += `/${seg}`;
      const isLast = idx === segments.length - 1;
      items.push({
        label: formatStatusLabel(seg),
        path: isLast ? undefined : currentPath,
      });
    });

    return items;
  };

  const items = customItems || generateFromPath();

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
      <Link
        to={homeRoute}
        className="inline-flex items-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
