import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import authService from '../services/authService';
import showToast from '../utils/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        showToast.success(result.message);
        setIsSubmitted(true);
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Check Your Email | Tsatsaku</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        
        <div className="main-gradient-bg font-sans antialiased">
          <main className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="auth-card">
              <div className="pt-10 pb-6 px-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Check your email</h1>
                <p className="mt-2 text-slate-500 font-medium">
                  We've sent a password reset link to {email}
                </p>
              </div>
              
              <div className="px-8 pb-10 text-center">
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Back to login
                </Link>
              </div>
            </div>
          </main>
          
          <footer className="py-8 text-center">
            <p className="text-slate-400 text-sm">© 2026 Tsatsaku. All rights reserved.</p>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forgot Password | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="main-gradient-bg font-sans antialiased">
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="auth-card">
            <div className="pt-10 pb-6 px-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="brand-logo">
                  <span className="text-white text-3xl font-bold">T</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Forgot Password?</h1>
              <p className="mt-2 text-slate-500 font-medium">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
            
            <div className="px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="input-field"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <Link href="/login" className="text-slate-600 text-sm hover:text-slate-700">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="py-8 text-center">
          <p className="text-slate-400 text-sm">© 2026 Tsatsaku. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}