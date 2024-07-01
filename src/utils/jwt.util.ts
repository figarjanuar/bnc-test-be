import jwt from 'jsonwebtoken';

export const generateToken = (payload: any) => {
  console.log(payload);
  
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};