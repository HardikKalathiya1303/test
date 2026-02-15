import api from './api';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Login successful'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'OTP verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetToken, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        resetToken,
        newPassword,
        confirmPassword
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Profile loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load profile',
        errors: error.response?.data?.errors || []
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('token') !== null;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  /**
   * Get current token
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
}

export default new AuthService();