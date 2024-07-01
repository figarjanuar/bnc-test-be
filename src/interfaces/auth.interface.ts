export interface LoginRequest {
  userId: string;
  password: string;
}

export interface RegisterRequest {
  userId: string;
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'Maker' | 'Approver';
  corporateName: string;
  corporateBankAccountNumber: string;
  otpCode: string;
}

export interface SendOTPRequest {
  email: string;
}