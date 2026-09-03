import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/inputs/Input';
import { Button } from '../../components/common/buttons/Button';
import { Mail, Lock, Bus, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Role } from '../../types';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('alex.rivera@corp-offgo.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'PENDING' | 'REJECTED'; message: string; reason?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    // Check for pending or rejected test accounts
    if (email.toLowerCase().includes('david') || email.toLowerCase().includes('pending')) {
      setIsLoading(false);
      setStatusMessage({
        type: 'PENDING',
        message: 'Your account registration is currently pending admin approval. You cannot access the system until your request is approved by an administrator.',
      });
      toast.error('Account approval pending.');
      return;
    }

    if (email.toLowerCase().includes('jennifer') || email.toLowerCase().includes('rejected')) {
      setIsLoading(false);
      setStatusMessage({
        type: 'REJECTED',
        message: 'Your registration request was rejected by the administrator.',
        reason: 'Unverified external email domain. Contractor approval required from HR lead.',
      });
      toast.error('Account registration was rejected.');
      return;
    }

    try {
      const loggedInUser = await login({ email, password, role });
      toast.success(`Welcome back, ${loggedInUser.name}`);
      if (loggedInUser.role === 'ADMIN') navigate('/admin/live-tracking');
      else if (loggedInUser.role === 'EMPLOYEE') navigate('/employee/dashboard');
      else navigate('/driver/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: Role) => {
    setRole(demoRole);
    setPassword('password123');
    if (demoRole === 'ADMIN') setEmail('alex.rivera@corp-offgo.com');
    else if (demoRole === 'EMPLOYEE') setEmail('sarah.j@corp-offgo.com');
    else setEmail('m.vance@corp-offgo.com');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Bus className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-white">OFF-GO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Sign In to Off-Go
        </h2>
        <p className="text-xs text-slate-400">
          Enter your corporate credentials or choose a quick demo profile below.
        </p>
      </div>

      {/* Demo Role Selector Pills */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Select Demo Persona:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              role === 'ADMIN'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Fleet Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('EMPLOYEE')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              role === 'EMPLOYEE' && !email.includes('pending') && !email.includes('rejected')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('DRIVER')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              role === 'DRIVER'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Driver
          </button>
        </div>

        {/* Demo Status Tests */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Test Account Statuses:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('david.hassel@company.com');
                setRole('EMPLOYEE');
              }}
              className="text-amber-400 hover:underline font-bold"
            >
              Test Pending User
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('jennifer.vance@external.com');
                setRole('EMPLOYEE');
              }}
              className="text-rose-400 hover:underline font-bold"
            >
              Test Rejected User
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-in fade-in duration-200 ${
            statusMessage.type === 'PENDING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>{statusMessage.type === 'PENDING' ? '⏳ Account Registration Pending' : '⛔ Registration Request Declined'}</span>
          </div>
          <p className="leading-relaxed">{statusMessage.message}</p>
          {statusMessage.reason && (
            <p className="pt-1 text-[11px] font-mono text-rose-400 border-t border-rose-500/20">
              <strong>Reason:</strong> {statusMessage.reason}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Corporate Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          placeholder="Enter your password (e.g. password123)"
          autoComplete="off"
          required
        />
        <p className="text-[11px] text-slate-500 font-medium">
          💡 Demo accounts password: <span className="font-mono text-indigo-400 font-bold">password123</span>
        </p>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400">
            <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500" defaultChecked />
            Remember session
          </label>
          <Link to="/forgot-password" className="text-indigo-400 hover:underline font-semibold">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Portal
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Need corporate access?{' '}
        <Link to="/register" className="text-indigo-400 hover:underline font-bold">
          Register Work Email
        </Link>
      </div>
    </div>
  );
};
