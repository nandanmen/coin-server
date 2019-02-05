import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from './models/User';
import Transaction from './models/Transaction';

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

router.post('/register', (req, res) => {
  const user = new User();
  const { username, password, name, income } = req.body;
  if (!username || !password || !name) {
    return res.json({
      success: false,
      error: 'You must provide a username, password and name',
    });
  }
  user._id = new mongoose.Types.ObjectId();
  user.username = username;
  user.password = password;
  user.name = name;
  user.income = income ? income : 0;
  user.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, id: user.id });
  });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
