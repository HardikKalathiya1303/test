'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/services/auth.service';
import Spinner from '@/components/ui/Spinner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !otp) router.push('/forgot-password');
  }, [email, otp, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await resetPassword(email, otp, formData.password);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  if (!email || !otp) return null;

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <nav className="w-full px-6 py-6 flex items-center absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Tsatsaku</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] animate-fadeIn">
          <div className="glass-card rounded-xl shadow-2xl p-8 md:p-10">
            <div className="flex flex-col items-center mb-8">
              {success ? (
                <>
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <span className="material-icons-outlined text-green-500 text-3xl">check_circle</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
                  <p className="text-gray-500 text-sm text-center">Your password has been changed successfully.</p>
                  <p className="text-xs text-gray-400 mt-4">Redirecting to sign in...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white mb-6 shadow-xl">
                    <span className="material-icons-outlined text-3xl">lock</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Set new password</h1>
                  <p className="text-gray-500 text-sm text-center">
                    Must be at least 8 characters with uppercase, lowercase, number & symbol
                  </p>
                </>
              )}
            </div>

            {!success && (
              <>
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
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                        value={formData.password} onChange={handleChange} placeholder="Enter new password" required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        <span className="material-icons-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password" required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none pr-12" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        <span className="material-icons-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 btn-gradient text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <Spinner size="sm" color="white" /> : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-primary-600 font-bold hover:underline inline-flex items-center gap-1">
              <span className="material-icons-outlined text-lg">arrow_back</span>
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size="xl" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
