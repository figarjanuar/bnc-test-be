import pool from '../config/database';

export const findByUserId = async (userId: string) => {
  const [rows]: any = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
  return rows[0];
};

export const create = async (userData: any) => {
  const [result]: any = await pool.query(
    'INSERT INTO users (user_id, password, name, email, phone_number, role, corporate_name, corporate_bank_account_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [userData.userId, userData.password, userData.name, userData.email, userData.phoneNumber, userData.role, userData.corporateName, userData.corporateBankAccountNumber]
  );
  return result;
};