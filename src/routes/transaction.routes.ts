import express from 'express';
import { getOverview, getTransactions, getTransactionDetail, auditTransaction, uploadTransactionCSV, createBatchTransaction } from '../controllers/transactionController';
import { validateCreateTransaction, validateAuditTransaction } from '../validators/transaction.validator';
import { authenticateToken } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/overview', authenticateToken, getOverview);
router.get('/', authenticateToken, getTransactions);
router.get('/:trxId', authenticateToken, getTransactionDetail);
router.post('/:referenceNo/audit', authenticateToken, validateAuditTransaction, auditTransaction);
router.post('/upload', authenticateToken, upload.single('file'), uploadTransactionCSV);
router.post('/batch', authenticateToken, validateCreateTransaction, createBatchTransaction);

export default router;