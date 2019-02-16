import app from './server';
import { connect } from './utils/db';
import config from './config';

const start = async () => {
  try {
    await connect();
    app.listen(config.port, () =>
      console.log(`Server listening on port ${config.port}`)
    );
  } catch (e) {
    console.error(e);
  }
};

start();
