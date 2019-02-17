import * as testRequest from 'supertest';
import { Request, Response } from 'express';
import app from '../../server';
import User from '../../resources/user/user.model';
import { verifyToken, makeToken } from '../auth';
import { CoinAuthResponse, IUser, CoinRequest } from '../../types';
import { protect } from '../auth';

process.env.TEST_SUITE = 'auth-tests';

describe('auth', () => {
  describe('register', () => {
    test('400 with no email/password/name', async () => {
      expect.assertions(2);

      const result = await testRequest(app)
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

      const result = await testRequest(app)
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

      const result = await testRequest(app)
        .post('/login')
        .send({});
      expect(result.status).toBe(400);

      const res: CoinAuthResponse = JSON.parse(result.text);
      expect(res.error).toBe('Email, and password is required');
    });

    test('404 for inexistent user', async () => {
      expect.assertions(2);

      const result = await testRequest(app)
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

      const result = await testRequest(app)
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

      const result = await testRequest(app)
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

  describe('protect', () => {
    test('401 with no headers', async () => {
      expect.assertions(2);

      const req = { headers: {} } as Request;
      const res = {
        status(code: number) {
          expect(code).toBe(401);
          return this;
        },
        send(obj) {
          expect(obj.error).toBe('Not authorized');
        },
      } as Response;

      await protect(req, res, () => {});
    });

    test('401 with incorrect header format', async () => {
      expect.assertions(2);

      const req = {
        headers: { authorization: makeToken({ id: 'abcd' } as IUser) },
      } as Request;
      const res = {
        status(code: number) {
          expect(code).toBe(401);
          return this;
        },
        send(obj) {
          expect(obj.error).toBe('Not authorized');
        },
      } as Response;

      await protect(req, res, () => {});
    });

    test('401 if correct format but user does not exist', async () => {
      expect.assertions(2);

      const req = {
        headers: {
          authorization: `Bearer ${makeToken({ id: 'abcd' } as IUser)}`,
        },
      } as Request;
      const res = {
        status(code: number) {
          expect(code).toBe(401);
          return this;
        },
        send(obj) {
          expect(obj.error).toBe('Not authorized');
        },
      } as Response;

      await protect(req, res, () => {});
    });

    test('adds user to req body if authorized', async () => {
      const user = await User.create({
        email: 'hello@example.com',
        password: 'abcd',
        name: 'John Doe',
      });

      const req = {
        headers: {
          authorization: `Bearer ${makeToken(user)}`,
        },
      } as CoinRequest;
      const res = {} as Response;

      const next = jest.fn();
      await protect(req, res, next);
      expect(next).toBeCalled();

      const passedUser = req.user;
      expect(passedUser).toBeTruthy();
      expect(passedUser._id.toHexString()).toBe(user._id.toHexString());
      expect(passedUser).not.toHaveProperty('password');
    });
  });
});
