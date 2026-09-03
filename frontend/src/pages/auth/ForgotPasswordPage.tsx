import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/inputs/Input';
import { Button } from '../../components/common/buttons/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      toast.success('Password reset link dispatched!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Reset Password
        </h2>
        <p className="text-xs text-slate-400">
          Enter your registered work email to receive a secure recovery link.
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Corporate Email"
            type="email"
            placeholder="alex.rivera@corp-offgo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
          <p className="text-xs text-slate-400">
            Check <span className="text-indigo-400 font-mono">{email}</span> for instructions to reset your password.
          </p>
        </div>
      )}

      <div className="text-center text-xs text-slate-500 pt-2">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:underline font-bold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
