import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

const API_PORT = process.env.API_PORT || 3001;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);

router.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
