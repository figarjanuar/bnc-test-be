"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.sendOTP = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel = __importStar(require("../models/user.model"));
const otpModel = __importStar(require("../models/otp.model"));
const otp_util_1 = require("../utils/otp.util");
const login = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel.findByUserId(loginData.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
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
});
exports.login = login;
const register = (registerData) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = yield otpModel.findByEmail(registerData.email);
    if (!otp || otp.code !== registerData.otpCode) {
        throw new Error('Invalid OTP');
    }
    const hashedPassword = yield bcrypt_1.default.hash(registerData.password, 10);
    const newUser = yield userModel.create(Object.assign(Object.assign({}, registerData), { password: hashedPassword }));
    yield otpModel.deleteOtp(registerData.email);
    const token = jsonwebtoken_1.default.sign({ userId: registerData.userId, role: registerData.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
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
});
exports.register = register;
const sendOTP = (otpData) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, otp_util_1.generateOTP)();
    yield (0, otp_util_1.sendOTPEmail)(otpData.email, otp).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield otpModel.create(otpData.email, otp);
    }));
    return { message: 'OTP sent successfully' };
});
exports.sendOTP = sendOTP;
const logout = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real-world scenario, you might want to invalidate the token here
    return { message: 'Logged out successfully' };
});
exports.logout = logout;
