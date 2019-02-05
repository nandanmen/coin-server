import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // Allows me to use .env variables

const API_PORT = process.env.API_PORT || 3001;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error('Cannot find DB URI variable');
  process.exit(1);
}

mongoose.connect(DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => console.error('MongoDB connection error'));

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);

router.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
