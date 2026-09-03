import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '../breadcrumbs/Breadcrumbs';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}) => {
  return (
    <div className="flex flex-col space-y-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 mb-6">
      <Breadcrumbs customItems={breadcrumbs} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};
