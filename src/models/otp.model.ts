import pool from '../config/database';

export const create = async (email: string, code: string) => {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 10 minutes from now
  const [result] = await pool.query(
    'INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)',
    [email, code, expiresAt]
  );
  return result;
};

export const findByEmail = async (email: string) => {
  const [rows]: any = await pool.query(
    'SELECT * FROM otp_codes WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [email]
  );
  return rows[0];
};

export const deleteOtp = async (email: string) => {
  const [result] = await pool.query('DELETE FROM otp_codes WHERE email = ?', [email]);
  return result;
};