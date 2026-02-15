const ContactQuery = require('../models/ContactQuery.model');
const { successResponse, errorResponse } = require('../utils/response.utils');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    const contactQuery = await ContactQuery.create({
      name,
      email,
      phone,
      subject,
      message
    });
    
    return successResponse(res, { id: contactQuery._id }, 'Your message has been submitted successfully. We will get back to you soon.', 201);
  } catch (error) {
    console.error('Submit contact error:', error);
    return errorResponse(res, error.message || 'Failed to submit message', 500);
  }
};
