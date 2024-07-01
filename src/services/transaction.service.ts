import pool from '../config/database';
import { CreateTransactionRequest, AuditTransactionRequest } from '../interfaces/transaction.interface';
import * as transactionModel from '../models/transaction.model';
import * as csv from 'fast-csv';
import fs from 'fs';

export const getOverview = async (userId: number, role: string) => {
  return await transactionModel.getOverview(userId, role);
};

export const getTransactions = async (userId: number, page: number, limit: number, status?: string) => {
  return await transactionModel.getTransactions(userId, page, limit, status);
};

export const getTransactionDetail = async (trxId: string) => {
  return await transactionModel.getTransactionDetail(trxId);
};

export const auditTransaction = async (referenceNo: string, auditData: AuditTransactionRequest, approverId: number) => {
  return await transactionModel.auditTransaction(referenceNo, auditData.action, approverId);
};

export const uploadTransactionCSV = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const errors: any[] = [];
    let totalAmount = 0;
    let rowNumber = 0;

    fs.createReadStream(file.path)
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
        } else {
          errors.push({ row: rowNumber, error: 'Invalid row data' });
        }
      })
      .on('end', () => {
        fs.unlinkSync(file.path);
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
};

export const createBatchTransaction = async (transactionData: CreateTransactionRequest, userId: number) => {
  const { fromAccountNo, instructionType, transferDate, transferTime, transactions } = transactionData;
  console.log(instructionType);
  
  if (!transactions || transactions.length === 0) {
    throw new Error('No transaction data provided');
  }

  const referenceNo = generateReferenceNo();
  const totalAmount = transactions.reduce((sum, tr) => sum + tr.transferAmount, 0);
  const totalRecords = transactions.length;
  console.log(referenceNo);
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert main transaction
    const [result]: any = await connection.query(
      'INSERT INTO transactions (reference_no, maker_id, from_account_no, total_amount, total_records, instruction_type, transfer_date, transfer_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [referenceNo, userId, fromAccountNo, totalAmount, totalRecords, instructionType, transferDate, transferTime, 'Awaiting Approval']
    );

    const transactionId = result.insertId;

    for (const detail of transactions) {
      await connection.query(
        'INSERT INTO transaction_details (transaction_id, to_bank_name, to_account_no, to_account_name, transfer_amount) VALUES (?, ?, ?, ?, ?)',
        [transactionId, detail.toBankName, detail.toAccountNo, detail.toAccountName, detail.transferAmount]
      );
    }

    await connection.commit();

    return { referenceNo, message: 'Batch transaction created successfully' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

function isValidRow(row: any) {
  return (
    row.to_bank_name &&
    row.to_account_no &&
    row.to_account_name &&
    !isNaN(parseFloat(row.transfer_amount))
  );
}

function generateReferenceNo() {
  return 'TRX' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 5).toUpperCase();
}