import express from 'express';
import bodyParser from 'body-parser';
import info from './routes/info.js';
import storageCell from './routes/storageCell.js';
import user from './routes/user.js';
import product from './routes/product.js';
import order from './routes/order.js';

const app = express();
const port = 2000;


app.use(bodyParser.json());


app.use('/infos', info);
app.use('/products', product);
app.use('/users', user);
app.use('/storage-cells', storageCell);
app.use('/orders', order);

  app.use((req, res, next) => {
    res.status(404).send('Страница не найдена');
  });


app.listen(port, () => {
  console.log(`Сервер запущен на: http://localhost:${port}`);
});