import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { info, storageCell, user, product, order, auth, cart } from './routes/index.js';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
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