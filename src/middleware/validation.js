const { body, query, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const otpRequestValidation = [
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('mobile').optional().isMobilePhone().withMessage('Invalid mobile number'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  validate
];

const verifyOtpValidation = [
  body('email').optional().isEmail().normalizeEmail(),
  body('mobile').optional().isMobilePhone(),
  body('otp').notEmpty().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  validate
];

const requirementValidation = [
  body('occasions').notEmpty().trim().withMessage('Occasions is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('fullName').notEmpty().trim().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('mobileNumber').notEmpty().trim().withMessage('Mobile number is required'),
  body('additionalInfo').optional().trim(),
  validate
];

const bookingValidation = [
  body('occasions').notEmpty().trim().withMessage('Occasions is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('city').notEmpty().trim().withMessage('City is required'),
  body('noOfAttendees').optional().isInt({ min: 1 }).withMessage('Number of attendees must be at least 1'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('fullName').notEmpty().trim().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('mobileNumber').notEmpty().trim().withMessage('Mobile number is required'),
  body('additionalInfo').optional().trim(),
  validate
];

const reviewValidation = [
  body('userName').notEmpty().trim().withMessage('User name is required'),
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('comment').optional().trim(),
  validate
];

const contactValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('message').notEmpty().trim().withMessage('Message is required'),
  validate
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

const actorFilterValidation = [
  query('tier').optional().isIn(['Premium', 'Standard', 'Basic']).withMessage('Invalid tier'),
  query('gender').optional().trim(),
  query('genre').optional().trim(),
  query('language').optional().trim(),
  query('eventType').optional().trim(),
  query('city').optional().trim(),
  ...paginationValidation
];

module.exports = {
  validate,
  otpRequestValidation,
  verifyOtpValidation,
  requirementValidation,
  bookingValidation,
  reviewValidation,
  contactValidation,
  paginationValidation,
  actorFilterValidation
};
