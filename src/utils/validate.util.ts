import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array().map(error => error.msg).join(', '));
    
    throw new Error(errors.array().map(error => error.msg).join(', '))
  }
} 