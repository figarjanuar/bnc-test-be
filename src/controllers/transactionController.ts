import { Request, Response } from 'express';
import * as transactionService from '../services/transaction.service';
import { CreateTransactionRequest, AuditTransactionRequest } from '../interfaces/transaction.interface';

export const getOverview = async (req: any, res: Response) => {
  try {
    const result = await transactionService.getOverview(req.user.id, req.user.role);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req: any, res: Response) => {
  console.log(req.user);
  const { page, limit, status } = req.query;
  
  try {
    const result = await transactionService.getTransactions(req.user.id, Number(page), Number(limit), status as string);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactionDetail = async (req: any, res: Response) => {
  const { trxId } = req.params;
  try {
    const result = await transactionService.getTransactionDetail(trxId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const auditTransaction = async (req: any, res: Response) => {
  const { referenceNo } = req.params;
  const auditData: AuditTransactionRequest = req.body;
  try {
    const result = await transactionService.auditTransaction(referenceNo, auditData, req.user.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadTransactionCSV = async (req: any, res: Response) => {
  try {
    const result = await transactionService.uploadTransactionCSV(req.file);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createBatchTransaction = async (req: any, res: Response) => {
  const transactionData: CreateTransactionRequest = req.body;
  try {
    const result = await transactionService.createBatchTransaction(transactionData, req.user.id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};