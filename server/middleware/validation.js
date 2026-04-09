import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// Validation rules for appointment creation
export const validateAppointmentCreation = [
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required')
    .matches(/^S\d{3,}$/)
    .withMessage('Student ID must be in format S followed by at least 3 digits'),

  body('doctorId')
    .trim()
    .notEmpty()
    .withMessage('Doctor ID is required')
    .matches(/^D\d+$/)
    .withMessage('Doctor ID must be in format D followed by digits'),

  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Cannot book appointments in the past');
      }
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      if (date > maxDate) {
        throw new Error('Cannot book appointments more than 30 days in advance');
      }
      if (date.getDay() === 0 || date.getDay() === 6) {
        throw new Error('Appointments are only available Monday to Friday');
      }
      return true;
    }),

  body('timeSlot')
    .isIn(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
    .withMessage('Invalid time slot selected'),

  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
    .matches(/^[a-zA-Z0-9\s.,!?-]+$/)
    .withMessage('Reason contains invalid characters'),

  handleValidationErrors
];

// Validation rules for appointment update
export const validateAppointmentUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid appointment ID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
    .custom((value) => {
      if (value) {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          throw new Error('Cannot reschedule to past dates');
        }
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        if (date > maxDate) {
          throw new Error('Cannot reschedule appointments more than 30 days in advance');
        }
        if (date.getDay() === 0 || date.getDay() === 6) {
          throw new Error('Appointments are only available Monday to Friday');
        }
      }
      return true;
    }),

  body('timeSlot')
    .optional()
    .isIn(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
    .withMessage('Invalid time slot selected'),

  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
    .matches(/^[a-zA-Z0-9\s.,!?-]+$/)
    .withMessage('Reason contains invalid characters'),

  handleValidationErrors
];

// Validation rules for appointment cancellation
export const validateAppointmentCancellation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid appointment ID'),

  handleValidationErrors
];

// Validation rules for queue status update
export const validateQueueStatusUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid queue ID'),

  body('status')
    .isIn(['waiting', 'active', 'done', 'emergency'])
    .withMessage('Status must be one of: waiting, active, done, emergency'),

  handleValidationErrors
];

// Validation rules for user position
export const validateUserPosition = [
  param('studentId')
    .trim()
    .matches(/^S\d{3,}$/)
    .withMessage('Student ID must be in format S followed by at least 3 digits'),

  handleValidationErrors
];