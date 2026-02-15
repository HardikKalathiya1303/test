const User = require('../models/User.model');
const Buyer = require('../models/Buyer.model');
const { generateToken } = require('../utils/jwt.utils');
const { successResponse, errorResponse } = require('../utils/response.utils');
const { validatePassword, generateOTP, generateRandomPassword } = require('../utils/validation.utils');
// const { sendEmail } = require('../services/email.service'); // Email functionality disabled

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, confirmPassword } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 400);
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return errorResponse(res, 'Password validation failed', 400, passwordValidation.errors);
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }
    
    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: 'buyer' // Default role for self-registration
    });
    
    // Send welcome email
    // await sendEmail(user.email, 'welcome', { name: user.firstName }, user.firstName); // Email functionality disabled
    
    // Generate token
    const token = generateToken({ userId: user._id, role: user.role });
    
    // Return user data without password
    const userData = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status
    };
    
    return successResponse(res, { user: userData, token }, 'Registration successful', 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, error.message || 'Registration failed', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    
    // Check if account is active
    if (user.status !== 'active') {
      return errorResponse(res, 'Your account has been deactivated. Please contact admin.', 401);
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    // Generate token
    const token = generateToken({ 
      userId: user._id, 
      role: user.role 
    });
    
    // Get buyer info if user is a buyer
    let buyerInfo = null;
    if (user.role === 'buyer') {
      buyerInfo = await Buyer.findOne({ userId: user._id });
    }
    
    // Return user data without password
    const userData = {
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
      moduleAccess: user.moduleAccess,
      buyerInfo
    };
    
    return successResponse(res, { user: userData, token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, error.message || 'Login failed', 500);
  }
};

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success even if user doesn't exist for security
      return successResponse(res, null, 'If the email exists, an OTP has been sent');
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP and expiry
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save({ validateBeforeSave: false });
    
    // Send OTP email
    // await sendEmail(user.email, 'password_reset', { name: user.firstName, otp }, user.firstName); // Email functionality disabled
    
    return successResponse(res, null, 'OTP has been sent to your email');
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(res, error.message || 'Failed to send OTP', 500);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user with valid OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOTP: otp,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordOTP +resetPasswordExpire');
    
    if (!user) {
      return errorResponse(res, 'Invalid or expired OTP', 400);
    }
    
    // Generate reset token
    const resetToken = generateToken({ userId: user._id, purpose: 'password_reset' }, '10m');
    
    return successResponse(res, { resetToken }, 'OTP verified successfully');
  } catch (error) {
    console.error('Verify OTP error:', error);
    return errorResponse(res, error.message || 'OTP verification failed', 500);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    
    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return errorResponse(res, 'Password validation failed', 400, passwordValidation.errors);
    }
    
    // Check password confirmation
    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match', 400);
    }
    
    // Verify reset token
    let decoded;
    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }
    
    if (decoded.purpose !== 'password_reset') {
      return errorResponse(res, 'Invalid reset token', 400);
    }
    
    // Find user and update password
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    // Send confirmation email
    // await sendEmail(user.email, 'password_changed', { name: user.firstName }, user.firstName); // Email functionality disabled
    
    return successResponse(res, null, 'Password reset successful');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(res, error.message || 'Password reset failed', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Token invalidation can be handled client-side
    // For server-side, you could implement a token blacklist
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(res, error.message || 'Logout failed', 500);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get buyer info if user is a buyer
    let buyerInfo = null;
    if (user.role === 'buyer') {
      buyerInfo = await Buyer.findOne({ userId: user._id });
    }
    
    const userData = {
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
      moduleAccess: user.moduleAccess,
      buyerInfo
    };
    
    return successResponse(res, { user: userData }, 'User fetched successfully');
  } catch (error) {
    console.error('Get me error:', error);
    return errorResponse(res, error.message || 'Failed to get user', 500);
  }
};
