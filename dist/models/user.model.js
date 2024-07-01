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
exports.create = exports.findByUserId = void 0;
const database_1 = __importDefault(require("../config/database"));
const findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return rows[0];
});
exports.findByUserId = findByUserId;
const create = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield database_1.default.query('INSERT INTO users (user_id, password, name, email, phone_number, role, corporate_name, corporate_bank_account_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [userData.userId, userData.password, userData.name, userData.email, userData.phoneNumber, userData.role, userData.corporateName, userData.corporateBankAccountNumber]);
    return result;
});
exports.create = create;
