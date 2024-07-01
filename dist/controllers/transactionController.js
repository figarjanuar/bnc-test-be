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
exports.createBatchTransaction = exports.uploadTransactionCSV = exports.auditTransaction = exports.getTransactionDetail = exports.getTransactions = exports.getOverview = void 0;
const transactionService = __importStar(require("../services/transaction.service"));
const getOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transactionService.getOverview(req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getOverview = getOverview;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, status } = req.query;
    try {
        const result = yield transactionService.getTransactions(req.user.id, Number(page), Number(limit), status);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getTransactions = getTransactions;
const getTransactionDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { referenceNo } = req.params;
    try {
        const result = yield transactionService.getTransactionDetail(referenceNo);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getTransactionDetail = getTransactionDetail;
const auditTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { referenceNo } = req.params;
    const auditData = req.body;
    try {
        const result = yield transactionService.auditTransaction(referenceNo, auditData, req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.auditTransaction = auditTransaction;
const uploadTransactionCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transactionService.uploadTransactionCSV(req.file);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.uploadTransactionCSV = uploadTransactionCSV;
const createBatchTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionData = req.body;
    try {
        const result = yield transactionService.createBatchTransaction(transactionData, req.user.id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createBatchTransaction = createBatchTransaction;
