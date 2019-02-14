import app from '../../server';
import * as request from 'supertest';
import { connect, disconnect } from '../db';
import { register, verifyToken } from '../auth';
import { CoinAuthResponse } from 'types';
import User from '../../resources/user/user.model';
import * as jwt from 'jsonwebtoken';

describe('Authorization:', () => {
  beforeEach(() => connect());
  afterEach(done => disconnect(done));

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
});
