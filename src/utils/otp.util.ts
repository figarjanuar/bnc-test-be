import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const config = {
    service: 'Gmail',
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }
  console.log(config);

  const transporter = nodemailer.createTransport(config);

  await transporter.sendMail({
    from: '"Batch Transfer App" <noreply@batchtransferapp.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    html: `<b>Your OTP code is: ${otp}</b><br>It will expire in 10 minutes.`,
  });
};