"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSendOTP = exports.validateRegister = exports.validateLogin = void 0;
const express_validator_1 = require("express-validator");
exports.validateLogin = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
exports.validateRegister = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('phoneNumber').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('role').notEmpty().withMessage('Role is required').isIn(['Maker', 'Approver']).withMessage('Invalid role'),
    (0, express_validator_1.body)('corporateName').notEmpty().withMessage('Corporate name is required'),
    (0, express_validator_1.body)('corporateBankAccountNumber').notEmpty().withMessage('Corporate bank account number is required'),
    (0, express_validator_1.body)('otpCode').notEmpty().withMessage('OTP code is required'),
];
exports.validateSendOTP = [
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];
