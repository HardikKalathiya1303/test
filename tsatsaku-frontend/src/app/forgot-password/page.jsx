'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPassword } from '@/services/auth.service';
import Spinner from '@/components/ui/Spinner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <nav className="w-full px-6 py-6 flex justify-between items-center absolute top-0 left-0 z-10">
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
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white mb-6 shadow-xl">
                <span className="material-icons-outlined text-3xl">lock_reset</span>
              </div>

              {success ? (
                <>
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-outlined text-green-500 text-3xl">mark_email_read</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                  <p className="text-gray-500 text-sm text-center">
                    We&apos;ve sent a 6-digit OTP to <strong className="text-gray-700">{email}</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-4">Redirecting to verification page...</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h1>
                  <p className="text-gray-500 text-sm text-center">
                    No worries! Enter your email and we&apos;ll send you a verification code.
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
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com" required autoComplete="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all outline-none" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 btn-gradient text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <Spinner size="sm" color="white" /> : (
                      <>
                        <span className="material-icons-outlined text-lg">send</span>
                        <span>Send Verification Code</span>
                      </>
                    )}
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
