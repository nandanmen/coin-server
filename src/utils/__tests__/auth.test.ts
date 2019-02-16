import * as request from 'supertest';
import app from '../../server';
import { verifyToken } from '../auth';
import { CoinAuthResponse } from 'types';
import User from '../../resources/user/user.model';

process.env.TEST_SUITE = 'auth-tests';

describe('Authorization:', () => {
  describe('register', () => {
    test('400 with no email/password/name', async () => {
      expect.assertions(2);

      const result = await request(app)
        .post('/register')
        .send({});
      expect(result.status).toBe(400);

      const res: CoinAuthResponse = JSON.parse(result.text);
      expect(res.error).toBe('Email, password, and name is required');
    });

    test('creates user and returns token', async () => {
      expect.assertions(2);

      const req = {
        email: 'hello@example.com',
        password: 'hello123',
        name: 'John Doe',
      };

      const result = await request(app)
        .post('/register')
        .send(req);
      expect(result.status).toBe(201);

      const res: CoinAuthResponse = JSON.parse(result.text);
      let user = await verifyToken(res.token);
      user = await User.findById(user.id);
      expect(user.email).toBe(req.email);
    });
  });

  describe('login', () => {
    test('400 with no email/password', async () => {
      expect.assertions(2);

      const result = await request(app)
        .post('/login')
        .send({});
      expect(result.status).toBe(400);

      const res: CoinAuthResponse = JSON.parse(result.text);
      expect(res.error).toBe('Email, and password is required');
    });

    test('404 for inexistent user', async () => {
      expect.assertions(2);

      const result = await request(app)
        .post('/login')
        .send({ email: 'hello@example.com', password: '1234' });
      expect(result.status).toBe(404);

      const res: CoinAuthResponse = JSON.parse(result.text);
      expect(res.error).toBe('Incorrect email or password');
    });

    test('401 for incorrect password', async () => {
      expect.assertions(2);

      await User.create({
        email: 'hello@example.com',
        password: '1234',
        name: 'John Doe',
      });

      const result = await request(app)
        .post('/login')
        .send({ email: 'hello@example.com', password: '5678' });
      expect(result.status).toBe(401);

      const res: CoinAuthResponse = JSON.parse(result.text);
      expect(res.error).toBe('Incorrect email or password');
    });

    test('returns new token for correct credentials', async () => {
      expect.assertions(2);

      const dbUser = await User.create({
        email: 'hello@example.com',
        password: 'abcd',
        name: 'John Doe',
      });

      const result = await request(app)
        .post('/login')
        .send({ email: 'hello@example.com', password: 'abcd' });
      expect(result.status).toBe(201);

      const res: CoinAuthResponse = JSON.parse(result.text);
      let user = await verifyToken(res.token);
      user = await User.findById(user.id)
        .lean()
        .exec();
      expect(user._id.toHexString()).toBe(dbUser._id.toHexString());
    });
  });
});
