const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { validatePassword } = require('../utils/validation.utils');
// const { sendEmail } = require('../services/email.service'); // Email functionality disabled

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const profileData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      phone: user.phone,
      country: user.country,
      state: user.state,
      city: user.city,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return successResponse(res, profileData, 'Profile fetched successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, error.message || 'Failed to fetch profile', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, country, state, city } = req.body;
    
    // Fields that can be updated
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (country !== undefined) updateFields.country = country;
    if (state !== undefined) updateFields.state = state;
    if (city !== undefined) updateFields.city = city;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    const profileData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      phone: user.phone,
      country: user.country,
      state: user.state,
      city: user.city,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return successResponse(res, profileData, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, error.message || 'Failed to update profile', 500);
  }
};

// @desc    Reset password from profile
// @route   PUT /api/profile/reset-password
// @access  Private
exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return errorResponse(res, 'Password validation failed', 400, passwordValidation.errors);
    }
    
    // Check password confirmation
    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }
    
    // Check if new password is same as current
    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      return errorResponse(res, 'New password must be different from current password', 400);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Send confirmation email
    // await sendEmail(user.email, 'password_changed', { name: user.firstName }, user.firstName); // Email functionality disabled
    
    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(res, error.message || 'Failed to reset password', 500);
  }
};
