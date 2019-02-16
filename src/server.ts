import * as express from 'express';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'body-parser';
import { register, login } from './utils/auth';

dotenv.config(); // Allows me to use .env variables

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use('/register', register);
app.use('/login', login);

export default app;
