import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { info, storageCell, user, product, order, auth, cart } from './routes/index.js';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

app.use('/api/info', info);
app.use('/api/storage-cell', storageCell);
app.use('/api/user', user);
app.use('/api/products', product);
app.use('/api/orders', order);
app.use('/api/cart', cart);
app.use('/api/auth', auth);

app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});