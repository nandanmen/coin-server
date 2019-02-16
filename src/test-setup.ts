import * as mongoose from 'mongoose';

beforeEach(done => {
  const clearDb = () => {
    for (const idx in mongoose.connection.collections) {
      mongoose.connection.collections[idx].deleteMany({});
    }
    return done();
  };

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(
      `mongodb://localhost:27017/${process.env.TEST_SUITE}`,
      err => {
        if (err) throw err;
        return clearDb();
      }
    );
  } else {
    return clearDb();
  }
});

afterEach(done => {
  mongoose.disconnect();
  return done();
});

afterAll(done => {
  return done();
});
