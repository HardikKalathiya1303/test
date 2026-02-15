'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    const result = await register(formData);
    if (!result.success) {
      setError(result.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size="xl" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      {/* Top Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Tsatsaku</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] animate-fadeIn">
          <div className="glass-card rounded-xl shadow-2xl p-8 md:p-10">
            {/* Brand Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white mb-6 shadow-xl">
                <span className="text-3xl font-extrabold">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-500 text-sm text-center">
                Join the Tsatsaku chemical trade platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <span className="material-icons-outlined text-red-500 text-xl flex-shrink-0 mt-0.5">error</span>
                <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <span className="material-icons-outlined text-lg">close</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                    placeholder="First name" required autoComplete="given-name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                    placeholder="Last name" required autoComplete="family-name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                  placeholder="name@company.com" required autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password}
                    onChange={handleChange} placeholder="Create a strong password" required autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    <span className="material-icons-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Must be at least 8 characters with uppercase, lowercase, number & symbol</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password"
                    required autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none pr-12" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    <span className="material-icons-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 btn-gradient text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</Link>
              <Link href="/terms-conditions" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
