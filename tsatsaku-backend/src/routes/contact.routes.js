const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const contactController = require('../controllers/contact.controller');

// Validation rules
const contactValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').notEmpty().trim().withMessage('Subject is required'),
  body('message').notEmpty().trim().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  body('phone').optional().trim()
];

// Routes (Public)
router.post('/', contactValidation, handleValidationErrors, contactController.submitContact);

module.exports = router;
