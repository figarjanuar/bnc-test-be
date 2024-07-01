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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.sendOTP = exports.register = exports.login = void 0;
const authService = __importStar(require("../services/auth.service"));
const validate_util_1 = require("../utils/validate.util");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_util_1.validateRequest)(req, res);
    const loginData = req.body;
    try {
        const result = yield authService.login(loginData);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_util_1.validateRequest)(req, res);
    const registerData = req.body;
    try {
        const result = yield authService.register(registerData);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.register = register;
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_util_1.validateRequest)(req, res);
    const otpData = req.body;
    try {
        const result = yield authService.sendOTP(otpData);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.sendOTP = sendOTP;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authService.logout(req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.logout = logout;
