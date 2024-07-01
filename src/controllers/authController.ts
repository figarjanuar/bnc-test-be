import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { LoginRequest, RegisterRequest, SendOTPRequest } from '../interfaces/auth.interface';
import { validateRequest } from '../utils/validate.util';

export const login = async (req: Request, res: Response) => {
  const loginData: LoginRequest = req.body;
  try {
    validateRequest(req, res)
    const result = await authService.login(loginData);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const registerData: RegisterRequest = req.body;
  try {
    validateRequest(req, res)
    const result = await authService.register(registerData);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  const otpData: SendOTPRequest = req.body;
  try {
    validateRequest(req, res)
    const result = await authService.sendOTP(otpData);
    return res.json(result);
  } catch (error: any) {
    console.log(error);
    
    return res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    const result = await authService.logout(req.user.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};