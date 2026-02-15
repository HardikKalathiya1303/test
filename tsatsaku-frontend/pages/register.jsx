import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import showToast from '../utils/toast';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    role: 'buyer',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      showToast.error('Password must be at least 8 characters long!');
      setIsLoading(false);
      return;
    }
    
    // Validate company name for buyers
    if (formData.role === 'buyer' && !formData.companyName.trim()) {
      showToast.error('Company name is required for buyer accounts!');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        showToast.success(result.message);
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Account | Tsatsaku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="registration-bg flex flex-col items-center justify-center p-6 font-sans antialiased text-slate-900 min-h-screen">
        {/* Registration Container */}
        <main className="w-full max-w-xl">
          {/* Header & Logo */}
          <header className="mb-8 text-center">
            {/* Branded 'T' Square Logo */}
            <div className="brand-logo-small">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
            <p className="mt-2 text-slate-600">Join Tsatsaku to get started</p>
          </header>
          
          {/* Registration Form Card */}
          <section className="form-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="input-field-brand"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="input-field-brand"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              {/* Contact & Company Info */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="input-field-brand"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane.doe@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="role">
                  Account Type
                </label>
                <select
                  className="input-field-brand"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="buyer">Buyer - Purchase products and manage orders</option>
                  <option value="man_user">Manager - Manage inventory and products</option>
                </select>
              </div>
              
              {/* Company Name - Required for buyers */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="companyName">
                  Company Name {formData.role === 'buyer' && <span className="text-red-500">*</span>}
                </label>
                <input
                  className="input-field-brand"
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Tsatsaku Inc."
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required={formData.role === 'buyer'}
                />
                {formData.role === 'buyer' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Company name is required for buyer accounts
                  </p>
                )}
              </div>
              
              {/* Password Security */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="input-field-brand pr-12"
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="input-field-brand pr-12"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-brand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </section>
          
          {/* Navigation Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account? 
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-8 text-slate-400 text-sm">
          <p>© 2026 Tsatsaku. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}