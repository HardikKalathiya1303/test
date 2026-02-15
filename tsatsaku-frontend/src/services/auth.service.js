import api from '@/lib/api';

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data;
};

// Reset password
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await api.post('/auth/reset-password', {
    resetToken,
    newPassword,
    confirmPassword
  });
  return response.data;
};

// Logout
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Ignore error on logout
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
