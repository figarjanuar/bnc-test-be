import express from 'express';
import { login, register, sendOTP, logout } from '../controllers/authController';
import { validateLogin, validateRegister, validateSendOTP } from '../validators/auth.validator';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/send-otp', validateSendOTP, sendOTP);
router.post('/logout', authenticateToken, logout);

export default router;