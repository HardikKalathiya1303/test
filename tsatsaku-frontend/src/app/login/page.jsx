'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Spinner size="xl" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Top Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-icons-outlined text-xl">science</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">Tsatsaku</span>
        </div>
        <div className="hidden md:flex gap-6">
          <Link href="/about" className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Platform</Link>
          <Link href="/contact" className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Support</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-mesh dark:bg-background-dark relative overflow-hidden">
        <div className="w-full max-w-[440px] animate-fadeIn z-10">
          {/* Login Card */}
          <div className="glass-card rounded-xl shadow-2xl p-8 md:p-10 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border border-primary/10">
            {/* Brand Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/30">
                <span className="text-3xl font-extrabold">T</span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Welcome back</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm text-center">
                Enter your credentials to access the chemical trade platform
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <span className="material-icons-outlined text-red-500 text-xl flex-shrink-0 mt-0.5">error</span>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 flex-1">{error}</p>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <span className="material-icons-outlined text-lg">close</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light hover:text-text-primary-light transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-icons-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface-light dark:bg-surface-dark px-3 text-text-secondary-light font-medium tracking-wider border border-border-light dark:border-border-dark rounded-full">
                  Enterprise Access
                </span>
              </div>
            </div>

            {/* SSO Button */}
            <button className="w-full py-3 border border-border-light dark:border-border-dark rounded-lg flex items-center justify-center gap-3 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors mb-4">
              <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDepvLWOn0nFOP0vPkoSJ8u_Fu3HWENYFoNamq7mTHfF-aLOvpNtyg1BlSiKxDxr2InuT5X4g2IfYtZNiD8f_WjW5a8z_UQ952GZdhikvXT6a4JuxkX285trU4im4vxZNT8S2ajrWF9Xn9dvEALSiB1bzl1T0HO3oz66RN33GFupxFbdMxxEWSAopvrr3KUmejudVNaPkHwXaFwUadpmL2BTv15D5xSuMrf3Nd-NO3QcBZhw6fYJnjoRBf3BLz62cTrVhT-YntsjvXq" />
              Sign in with Single Sign-On
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              New to Tsatsaku?
              <Link href="/register" className="text-primary font-bold hover:underline ml-1">Create Account</Link>
            </p>
            <div className="flex justify-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-text-secondary-light hover:text-text-primary-light dark:hover:text-text-primary-dark">Privacy Policy</Link>
              <Link href="/terms-conditions" className="text-xs text-text-secondary-light hover:text-text-primary-light dark:hover:text-text-primary-dark">Terms of Service</Link>
              <Link href="/contact" className="text-xs text-text-secondary-light hover:text-text-primary-light dark:hover:text-text-primary-dark">Compliance</Link>
            </div>
          </div>
        </div>

        {/* Visual Accent Element */}
        <div className="hidden lg:block fixed bottom-10 right-10 opacity-20 dark:opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-primary" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90.1,-17.6,89.1,-2.3C88.1,13,83.4,27.9,75.4,41.1C67.4,54.3,56.1,65.8,42.4,72.8C28.7,79.8,12.7,82.3,-2.8,87.1C-18.3,91.9,-33.3,99,-47.5,95.5C-61.7,92,-75.1,78,-83.4,62.1C-91.7,46.2,-94.9,28.4,-94.3,11.3C-93.7,-5.8,-89.3,-22.2,-81,-36.4C-72.7,-50.6,-60.5,-62.6,-46.8,-70.2C-33.1,-77.8,-17.9,-81, -1.3,-78.8C15.3,-76.6,30.6,-83.6,44.7,-76.4Z" fill="currentColor" transform="translate(100 100)"></path>
          </svg>
        </div>
      </main>
    </div>
  );
}
