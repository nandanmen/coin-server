import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as dotenv from 'dotenv';
import { connect } from './utils/db';
import { config } from './config';

dotenv.config(); // Allows me to use .env variables

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

export const start = async () => {
  try {
    await connect();
    app.listen(config.port, () =>
      console.log(`Server listening on port ${config.port}`)
    );
  } catch (e) {
    console.error(e);
  }
};
