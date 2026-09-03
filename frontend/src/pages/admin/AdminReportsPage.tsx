import React from 'react';
import { ReportsDashboard } from '../../components/admin/reports/ReportsDashboard';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ReportsDashboard />
    </div>
  );
};

export default AdminReportsPage;
