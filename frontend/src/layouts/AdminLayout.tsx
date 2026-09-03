import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/sidebar/Sidebar';
import { Footer } from '../components/layout/footer/Footer';
import { MobileBottomTabBar } from '../components/layout/bottom-bar/MobileBottomTabBar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased pb-16 lg:pb-0">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
      <MobileBottomTabBar />
    </div>
  );
};
