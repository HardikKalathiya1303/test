import api from '@/lib/api';

// Get profile
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

// Update profile
export const updateProfile = async (data) => {
  const response = await api.put('/profile', data);
  return response.data;
};

// Reset password from profile
export const resetPassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.put('/profile/reset-password', {
    currentPassword,
    newPassword,
    confirmPassword
  });
  return response.data;
};
