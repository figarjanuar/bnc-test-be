import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;