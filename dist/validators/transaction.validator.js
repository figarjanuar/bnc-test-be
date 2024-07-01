"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuditTransaction = exports.validateCreateTransaction = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateTransaction = [
    (0, express_validator_1.body)('fromAccountNo').notEmpty().withMessage('From account number is required'),
    (0, express_validator_1.body)('instructionType').notEmpty().withMessage('Instruction type is required').isIn(['Immediate', 'Standing']).withMessage('Invalid instruction type'),
    (0, express_validator_1.body)('transferDate').optional().isISO8601().toDate().withMessage('Invalid transfer date'),
    (0, express_validator_1.body)('transferTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid transfer time format'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('transactions').isArray().withMessage('Transactions must be an array'),
    (0, express_validator_1.body)('transactions.*.toBankName').notEmpty().withMessage('To bank name is required'),
    (0, express_validator_1.body)('transactions.*.toAccountNo').notEmpty().withMessage('To account number is required'),
    (0, express_validator_1.body)('transactions.*.toAccountName').notEmpty().withMessage('To account name is required'),
    (0, express_validator_1.body)('transactions.*.transferAmount').isNumeric().withMessage('Transfer amount must be a number'),
    (0, express_validator_1.body)('transactions.*.description').optional().isString(),
];
exports.validateAuditTransaction = [
    (0, express_validator_1.body)('action').notEmpty().withMessage('Action is required').isIn(['Approve', 'Reject']).withMessage('Invalid action'),
];
