"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_validator_1 = require("../validators/auth.validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/login', auth_validator_1.validateLogin, authController_1.login);
router.post('/register', auth_validator_1.validateRegister, authController_1.register);
router.post('/send-otp', auth_validator_1.validateSendOTP, authController_1.sendOTP);
router.post('/logout', auth_middleware_1.authenticateToken, authController_1.logout);
exports.default = router;
