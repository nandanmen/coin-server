import * as express from 'express';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import { register, login, protect } from './utils/auth';
import categoryRouter from './resources/category/category.router';
import feRouter from './resources/fixedExpense/fixedExpense.router';
import userRouter from './resources/user/user.router';
import trRouter from './resources/transaction/transaction.router';

dotenv.config(); // Allows me to use .env variables

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use('/register', register);
app.use('/login', login);

app.use('/api', protect);
app.use('/api/ctg', categoryRouter);
app.use('/api/fe', feRouter);
app.use('/api/me', userRouter);
app.use('/api/tr', trRouter);

export default app;
