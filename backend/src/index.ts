import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import productRouter from './routes/products';
import authRouter from './routes/auth';
import cartRouter from './routes/cart';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/products', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 