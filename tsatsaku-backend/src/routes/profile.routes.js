const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

// Validation rules
const updateProfileValidation = [
  body('firstName').optional().notEmpty().trim().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().trim().withMessage('Last name cannot be empty'),
  body('phone').optional().trim(),
  body('country').optional().trim(),
  body('state').optional().trim(),
  body('city').optional().trim()
];

const resetPasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', profileController.getProfile);
router.put('/', updateProfileValidation, handleValidationErrors, profileController.updateProfile);
router.put('/reset-password', resetPasswordValidation, handleValidationErrors, profileController.resetPassword);

module.exports = router;
