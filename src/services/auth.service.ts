import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest, SendOTPRequest } from '../interfaces/auth.interface';
import * as userModel from '../models/user.model';
import * as otpModel from '../models/otp.model';
import { generateOTP, sendOTPEmail } from '../utils/otp.util';

export const login = async (loginData: LoginRequest) => {
  const user = await userModel.findByUserId(loginData.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id, userId: user.user_id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '3h' });

  return {
    accessToken: token,
    userInfo: {
      id: user.id,
      userId: user.user_id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
      corporateName: user.corporate_name,
      corporateBankAccountNumber: user.corporate_bank_account_number
    }
  };
};

export const register = async (registerData: RegisterRequest) => {
  const otp = await otpModel.findByEmail(registerData.email);
  if (!otp || otp.code !== registerData.otpCode) {
    throw new Error('Invalid OTP');
  }

  const hashedPassword = await bcrypt.hash(registerData.password, 10);
  const newUser = await userModel.create({
    ...registerData,
    password: hashedPassword
  });
  
  await otpModel.deleteOtp(registerData.email);

  const token = jwt.sign({ id: newUser.insertId, userId: registerData.userId, role: registerData.role }, process.env.JWT_SECRET as string, { expiresIn: '3h' });

  return {
    accessToken: token,
    userInfo: {
        userId: registerData.userId,
        name: registerData.name,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        role: registerData.role,
        corporateName: registerData.corporateName,
        corporateBankAccountNumber: registerData.corporateBankAccountNumber
      }
  };
};

export const sendOTP = async (otpData: SendOTPRequest) => {
  const otp = generateOTP();
  await sendOTPEmail(otpData.email, otp).then(async () => {
      await otpModel.create(otpData.email, otp);
  });
  return { message: 'OTP sent successfully' };
};

export const logout = async (userId: number) => {
  // In a real-world scenario, you might want to invalidate the token here
  return { message: 'Logged out successfully' };
};