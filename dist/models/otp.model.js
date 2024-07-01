"use strict";
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
exports.deleteOtp = exports.findByEmail = exports.create = void 0;
const database_1 = __importDefault(require("../config/database"));
const create = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 10 minutes from now
    const [result] = yield database_1.default.query('INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)', [email, code, expiresAt]);
    return result;
});
exports.create = create;
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query('SELECT * FROM otp_codes WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1', [email]);
    return rows[0];
});
exports.findByEmail = findByEmail;
const deleteOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield database_1.default.query('DELETE FROM otp_codes WHERE email = ?', [email]);
    return result;
});
exports.deleteOtp = deleteOtp;
