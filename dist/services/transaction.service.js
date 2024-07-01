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
exports.createBatchTransaction = exports.uploadTransactionCSV = exports.auditTransaction = exports.getTransactionDetail = exports.getTransactions = exports.getOverview = void 0;
const database_1 = __importDefault(require("../config/database"));
const transactionModel = __importStar(require("../models/transaction.model"));
const csv = __importStar(require("fast-csv"));
const fs_1 = __importDefault(require("fs"));
const getOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactionModel.getOverview(userId);
});
exports.getOverview = getOverview;
const getTransactions = (userId, page, limit, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactionModel.getTransactions(userId, page, limit, status);
});
exports.getTransactions = getTransactions;
const getTransactionDetail = (referenceNo) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactionModel.getTransactionDetail(referenceNo);
});
exports.getTransactionDetail = getTransactionDetail;
const auditTransaction = (referenceNo, auditData, approverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transactionModel.auditTransaction(referenceNo, auditData.action, approverId);
});
exports.auditTransaction = auditTransaction;
const uploadTransactionCSV = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const results = [];
        const errors = [];
        let totalAmount = 0;
        let rowNumber = 0;
        fs_1.default.createReadStream(file.path)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', row => {
            rowNumber++;
            if (isValidRow(row)) {
                results.push({
                    toBankName: row.to_bank_name,
                    toAccountNo: row.to_account_no,
                    toAccountName: row.to_account_name,
                    transferAmount: parseFloat(row.transfer_amount),
                    description: row.description || ''
                });
                totalAmount += parseFloat(row.transfer_amount);
            }
            else {
                errors.push({ row: rowNumber, error: 'Invalid row data' });
            }
        })
            .on('end', () => {
            fs_1.default.unlinkSync(file.path);
            resolve({
                totalRecords: rowNumber - 1,
                totalAmount,
                validRecords: results.length,
                invalidRecords: errors.length,
                errors,
                transactions: results
            });
        });
    });
});
exports.uploadTransactionCSV = uploadTransactionCSV;
const createBatchTransaction = (transactionData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromAccountNo, instructionType, transferDate, transferTime, description, transactions } = transactionData;
    if (!transactions || transactions.length === 0) {
        throw new Error('No transaction data provided');
    }
    const referenceNo = generateReferenceNo();
    const totalAmount = transactions.reduce((sum, tr) => sum + tr.transferAmount, 0);
    const totalRecords = transactions.length;
    const connection = yield database_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        // Insert main transaction
        const [result] = yield connection.query('INSERT INTO transactions (reference_no, maker_id, from_account_no, total_amount, total_records, instruction_type, transfer_date, transfer_time, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [referenceNo, userId, fromAccountNo, totalAmount, totalRecords, instructionType, transferDate, transferTime, 'Awaiting Approval', description]);
        const transactionId = result.insertId;
        // Insert transaction details
        for (const detail of transactions) {
            yield connection.query('INSERT INTO transaction_details (transaction_id, to_bank_name, to_account_no, to_account_name, transfer_amount, description) VALUES (?, ?, ?, ?, ?, ?)', [transactionId, detail.toBankName, detail.toAccountNo, detail.toAccountName, detail.transferAmount, detail.description]);
        }
        yield connection.commit();
        return { referenceNo, message: 'Batch transaction created successfully' };
    }
    catch (error) {
        yield connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
});
exports.createBatchTransaction = createBatchTransaction;
function isValidRow(row) {
    return (row.to_bank_name &&
        row.to_account_no &&
        row.to_account_name &&
        !isNaN(parseFloat(row.transfer_amount)));
}
function generateReferenceNo() {
    return 'TRX' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase();
}
