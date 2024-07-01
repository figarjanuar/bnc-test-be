import pool from '../config/database';

export const getOverview = async (userId: number, role: string) => {
  let query = 'SELECT status, COUNT(*) as count FROM transactions'
  const params: any[] = [];

  if(role === 'Maker') {
    query += ' WHERE maker_id = ?'
    params.push(userId)
  }

  query += ' GROUP BY status'
  console.log(query);
  
  const [rows]: any = await pool.query(query,params);
  return rows.reduce((acc: any, row: any) => {
    acc[row.status.toLowerCase()] = row.count;
    return acc;
  }, { 'awaiting approval': 0, approved: 0, rejected: 0 });
};

export const getTransactions = async (userId: number, page: number, limit: number, role?: string) => {
  let query = 'SELECT t.*, u.name FROM transactions t LEFT JOIN users u on u.id = t.maker_id';
  let countQuery = 'SELECT COUNT(*) as total FROM transactions'
  const params: any[] = [];
  const countParams: any[] = [];

  if(role === 'Maker') {
    query += ' WHERE maker_id = ?'
    params.push(userId)

    countQuery += ' WHERE maker_id = ?'
    countParams.push(userId)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  const [rows] = await pool.query(query, params);
  const [countResult]: any = await pool.query(countQuery, countParams);
  const totalCount = countResult[0].total;

  return {
    transactions: rows,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page
  };
};

export const getTransactionDetail = async (trxId: string) => {
  const [details] = await pool.query('SELECT * FROM transaction_details WHERE transaction_id = ?', trxId);
  return details;
};

export const auditTransaction = async (referenceNo: string, action: string, approverId: number) => {
  const status = action === 'Approve' ? 'Approved' : 'Rejected';
  const [result] = await pool.query(
    'UPDATE transactions SET status = ?, approver_id = ? WHERE reference_no = ?',
    [status, approverId, referenceNo]
  );
  return result;
};

export const createBatchTransaction = async (referenceNo: string, transactionData: any, userId: number) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result]: any = await connection.query(
      'INSERT INTO transactions (reference_no, maker_id, from_account_no, total_amount, total_records, instruction_type, transfer_date, transfer_time, status, corporate_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [referenceNo, userId, transactionData.fromAccountNo, transactionData.totalAmount, transactionData.totalRecords, transactionData.instructionType, transactionData.transferDate, transactionData.transferTime, 'Awaiting Approval', transactionData.corporateName]
    );

    const transactionId = result.insertId;

    for (const detail of transactionData.details) {
      await connection.query(
        'INSERT INTO transaction_details (transaction_id, to_bank_name, to_account_no, to_account_name, transfer_amount, description) VALUES (?, ?, ?, ?, ?, ?)',
        [transactionId, detail.toBankName, detail.toAccountNo, detail.toAccountName, detail.transferAmount, detail.description]
      );
    }

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};