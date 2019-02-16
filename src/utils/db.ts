import * as mongoose from 'mongoose';
import config from '../config';

export const connect = (url = config.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};

export const disconnect = async (done: (error?: any) => void) => {
  await mongoose.disconnect();
  done();
};
