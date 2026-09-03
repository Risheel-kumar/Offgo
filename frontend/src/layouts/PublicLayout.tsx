import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { Button } from '../components/common/buttons/Button';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased">
      <header className="h-20 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bus className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">OFF-GO</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/40 py-8 px-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Off-Go Platform. Corporate Shuttle Logistics Engine.</p>
      </footer>
    </div>
  );
};
