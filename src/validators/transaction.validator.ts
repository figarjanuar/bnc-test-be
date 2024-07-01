import { body } from 'express-validator';

export const validateCreateTransaction = [
  body('fromAccountNo').notEmpty().withMessage('From account number is required'),
  body('instructionType').notEmpty().withMessage('Instruction type is required').isIn(['Immediate', 'Standing']).withMessage('Invalid instruction type'),
  body('transferDate').optional().isISO8601().toDate().withMessage('Invalid transfer date'),
  body('transferTime').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid transfer time format'),
  body('description').optional().isString(),
  body('transactions').isArray().withMessage('Transactions must be an array'),
  body('transactions.*.toBankName').notEmpty().withMessage('To bank name is required'),
  body('transactions.*.toAccountNo').notEmpty().withMessage('To account number is required'),
  body('transactions.*.toAccountName').notEmpty().withMessage('To account name is required'),
  body('transactions.*.transferAmount').isNumeric().withMessage('Transfer amount must be a number'),
  body('transactions.*.description').optional().isString(),
];

export const validateAuditTransaction = [
  body('action').notEmpty().withMessage('Action is required').isIn(['Approve', 'Reject']).withMessage('Invalid action'),
];