"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const transaction_validator_1 = require("../validators/transaction.validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.get('/overview', auth_middleware_1.authenticateToken, transactionController_1.getOverview);
router.get('/', auth_middleware_1.authenticateToken, transactionController_1.getTransactions);
router.get('/:referenceNo', auth_middleware_1.authenticateToken, transactionController_1.getTransactionDetail);
router.post('/:referenceNo/audit', auth_middleware_1.authenticateToken, transaction_validator_1.validateAuditTransaction, transactionController_1.auditTransaction);
router.post('/upload', auth_middleware_1.authenticateToken, upload.single('file'), transactionController_1.uploadTransactionCSV);
router.post('/batch', auth_middleware_1.authenticateToken, transaction_validator_1.validateCreateTransaction, transactionController_1.createBatchTransaction);
exports.default = router;
