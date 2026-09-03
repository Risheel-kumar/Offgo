import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../../types';
import { Input } from '../../components/common/inputs/Input';
import { Select } from '../../components/common/inputs/Select';
import { Button } from '../../components/common/buttons/Button';
import { Mail, Lock, User, Clock, ArrowRight, ShieldCheck, Phone, Badge } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    employeeId: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    department: string;
    role: Role;
  }>({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Engineering',
    role: 'EMPLOYEE',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);

    try {
      await register(formData);
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Registration submitted! Awaiting administrator approval.');
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Registration Pending Approval</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your corporate shuttle account request for <strong className="text-slate-200">{formData.email}</strong> has been submitted.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">Account Review Process</strong>
              <span>System administrators will review your department credentials. Once approved, you can log in immediately.</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <span>Status: <strong className="text-amber-400 font-bold">PENDING_APPROVAL</strong></span>
            <span>Department: <strong>{formData.department}</strong></span>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/login')}
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Register Work Account
        </h2>
        <p className="text-xs text-slate-400">
          Request corporate shuttle clearance for your company SSO domain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          leftIcon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Employee ID"
          type="text"
          placeholder="EMP-1001"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          leftIcon={<Badge className="w-4 h-4" />}
          required
        />

        <Input
          label="Corporate Work Email"
          type="email"
          placeholder="jane.doe@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          leftIcon={<Phone className="w-4 h-4" />}
          required
        />

        <Select
          label="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          options={[
            { value: 'Engineering', label: 'Engineering & Tech' },
            { value: 'Operations', label: 'Global Operations' },
            { value: 'HR', label: 'Human Resources' },
            { value: 'Sales', label: 'Enterprise Sales' },
          ]}
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit Access Request
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Already registered?{' '}
        <Link to="/login" className="text-indigo-400 hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
};
