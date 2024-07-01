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
exports.createBatchTransaction = exports.auditTransaction = exports.getTransactionDetail = exports.getTransactions = exports.getOverview = void 0;
const database_1 = __importDefault(require("../config/database"));
const getOverview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query('SELECT status, COUNT(*) as count FROM transactions WHERE maker_id = ? GROUP BY status', [userId]);
    return rows.reduce((acc, row) => {
        acc[row.status.toLowerCase()] = row.count;
        return acc;
    }, { awaitingApproval: 0, approved: 0, rejected: 0 });
});
exports.getOverview = getOverview;
const getTransactions = (userId, page, limit, status) => __awaiter(void 0, void 0, void 0, function* () {
    let query = 'SELECT * FROM transactions WHERE maker_id = ?';
    const params = [userId];
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    const [rows] = yield database_1.default.query(query, params);
    const [countResult] = yield database_1.default.query('SELECT COUNT(*) as total FROM transactions WHERE maker_id = ?', [userId]);
    const totalCount = countResult[0].total;
    return {
        transactions: rows,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
    };
});
exports.getTransactions = getTransactions;
const getTransactionDetail = (referenceNo) => __awaiter(void 0, void 0, void 0, function* () {
    const [transaction] = yield database_1.default.query('SELECT * FROM transactions WHERE reference_no = ?', [referenceNo]);
    const [details] = yield database_1.default.query('SELECT * FROM transaction_details WHERE transaction_id = ?', [transaction[0].id]);
    return Object.assign(Object.assign({}, transaction[0]), { details });
});
exports.getTransactionDetail = getTransactionDetail;
const auditTransaction = (referenceNo, action, approverId) => __awaiter(void 0, void 0, void 0, function* () {
    const status = action === 'Approve' ? 'Approved' : 'Rejected';
    const [result] = yield database_1.default.query('UPDATE transactions SET status = ?, approver_id = ? WHERE reference_no = ?', [status, approverId, referenceNo]);
    return result;
});
exports.auditTransaction = auditTransaction;
const createBatchTransaction = (referenceNo, transactionData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield database_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const [result] = yield connection.query('INSERT INTO transactions (reference_no, maker_id, from_account_no, total_amount, total_records, instruction_type, transfer_date, transfer_time, status, corporate_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [referenceNo, userId, transactionData.fromAccountNo, transactionData.totalAmount, transactionData.totalRecords, transactionData.instructionType, transactionData.transferDate, transactionData.transferTime, 'Awaiting Approval', transactionData.corporateName]);
        const transactionId = result.insertId;
        for (const detail of transactionData.details) {
            yield connection.query('INSERT INTO transaction_details (transaction_id, to_bank_name, to_account_no, to_account_name, transfer_amount, description) VALUES (?, ?, ?, ?, ?, ?)', [transactionId, detail.toBankName, detail.toAccountNo, detail.toAccountName, detail.transferAmount, detail.description]);
        }
        yield connection.commit();
        return result;
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
