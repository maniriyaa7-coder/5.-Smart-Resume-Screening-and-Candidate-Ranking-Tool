import { body, validationResult } from 'express-validator';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

/**
 * Candidate Registration validation rules
 */
export const validateCandidateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('college')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),

  body('skills')
    .notEmpty()
    .withMessage('Skills are required'),

  body('currentLocation')
    .trim()
    .notEmpty()
    .withMessage('Current location is required'),

  handleValidationErrors,
];

/**
 * Recruiter Registration validation rules
 */
export const validateRecruiterRegister = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),

  body('recruiterName')
    .trim()
    .notEmpty()
    .withMessage('Recruiter name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Recruiter name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('companyWebsite')
    .trim()
    .notEmpty()
    .withMessage('Company website is required')
    .matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
    .withMessage('Please provide a valid website URL'),

  body('companyLocation')
    .trim()
    .notEmpty()
    .withMessage('Company location is required'),

  handleValidationErrors,
];

/**
 * Legacy registration validation (for backward compatibility)
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['recruiter', 'candidate'])
    .withMessage('Role must be either recruiter or candidate'),

  body('company')
    .if(body('role').equals('recruiter'))
    .trim()
    .notEmpty()
    .withMessage('Company name is required for recruiters'),

  handleValidationErrors,
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

/**
 * Refresh token validation
 */
export const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),

  handleValidationErrors,
];
