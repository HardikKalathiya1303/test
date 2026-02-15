'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyOTP, forgotPassword } from '@/services/auth.service';
import Spinner from '@/components/ui/Spinner';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) router.push('/forgot-password');
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => { if (index < 6) newOtp[index] = char; });
    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Please enter the complete 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await verifyOTP(email, otpString);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`);
        }, 1500);
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const response = await forgotPassword(email);
      if (response.success) { setCountdown(60); setOtp(['', '', '', '', '', '']); }
      else { setError(response.message || 'Failed to resend OTP'); }
    } catch (err) { setError('Failed to resend OTP'); }
    setResending(false);
  };

  if (!email) return null;

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
                    <span className="material-icons-outlined text-green-500 text-3xl">verified</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h1>
                  <p className="text-gray-500 text-sm">Redirecting to reset password...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white mb-6 shadow-xl">
                    <span className="material-icons-outlined text-3xl">pin</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h1>
                  <p className="text-gray-500 text-sm text-center">
                    We sent a 6-digit code to <strong className="text-gray-700">{email}</strong>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 btn-gradient text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <Spinner size="sm" color="white" /> : 'Verify Code'}
                  </button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend code in <span className="font-semibold text-gray-700">{countdown}s</span>
                      </p>
                    ) : (
                      <button type="button" onClick={handleResend} disabled={resending}
                        className="text-sm text-primary-600 hover:text-primary-700 font-bold">
                        {resending ? 'Sending...' : 'Resend Code'}
                      </button>
                    )}
                  </div>
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

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size="xl" />
      </div>
    }>
      <VerifyOTPForm />
    </Suspense>
  );
}
