import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { showToast } = useApp();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rajesh.kumar@skillbridge.pro');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email, password, rememberMe);
      showToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('rajesh.kumar@skillbridge.pro');
    setPassword('password123');
    try {
      setIsLoading(true);
      setError('');
      await login('rajesh.kumar@skillbridge.pro', 'password123', true);
      showToast('Successfully logged in!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SkillBridge
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <Card className="p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800">
          <div className="mb-6 text-center">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 uppercase tracking-wider mb-3 inline-block">
              Worker Portal
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Worker Login
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Welcome back! Sign in to access your jobs, schedule, and earnings.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="worker@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-blue-600/20 font-bold"
                isLoading={isLoading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Sign In to Portal
              </Button>
            </div>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleDemoLogin}
                className="w-full text-xs font-semibold"
                icon={Sparkles}
              >
                Quick Demo Access
              </Button>
            </div>
          </form>

          <div className="text-center pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Don't have a worker account?{' '}
            <Link
              to="/register"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Register as Worker
            </Link>
          </div>
        </Card>
      </div>

      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 py-4">
        © {new Date().getFullYear()} SkillBridge. All rights reserved.
      </footer>
    </div>
  );
}
