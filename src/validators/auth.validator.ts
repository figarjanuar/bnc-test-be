import { body } from 'express-validator';

export const validateLogin = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateRegister = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('role').notEmpty().withMessage('Role is required').isIn(['Maker', 'Approver']).withMessage('Invalid role'),
  body('corporateName').notEmpty().withMessage('Corporate name is required'),
  body('corporateBankAccountNumber').notEmpty().withMessage('Corporate bank account number is required'),
  body('otpCode').notEmpty().withMessage('OTP code is required'),
];

export const validateSendOTP = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];