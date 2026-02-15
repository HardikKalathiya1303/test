import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import showToast from '../utils/toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        showToast.success(result.message);
        
        // Redirect based on user role
        const userRole = result.data.user.role;
        let redirectPath = '/dashboard';
        
        switch (userRole) {
          case 'admin':
            redirectPath = '/dashboard';
            break;
          case 'man_user':
            redirectPath = '/dashboard';
            break;
          case 'buyer':
            redirectPath = '/dashboard';
            break;
          default:
            redirectPath = '/dashboard';
        }
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Tsatsaku - Trade-as-a-Service</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="main-gradient-bg font-sans antialiased">
        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="auth-card">
            {/* Card Header */}
            <div className="pt-10 pb-6 px-8 text-center">
              {/* Logo Element */}
              <div className="flex justify-center mb-6">
                <div className="brand-logo">
                  <span className="text-white text-3xl font-bold">T</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
              <p className="mt-2 text-slate-500 font-medium">Log in to your Tsatsaku account</p>
            </div>
            
            {/* Login Form */}
            <div className="px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      className="input-field pr-12"
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
                
                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 block text-sm text-slate-600" htmlFor="rememberMe">
                    Remember this device
                  </label>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              {/* Secondary Action */}
              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-600 text-sm">
                  Don't have an account? 
                  <Link href="/register" className="ml-1 font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-slate-400 text-sm">© 2026 Tsatsaku. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}