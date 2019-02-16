import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { RequestHandler } from 'express';
import { IUser } from '../types';
import User from '../resources/user/user.model';

const { jwtSecret, jwtExp } = config.secrets;

export const makeToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: jwtExp,
  });
};

export const verifyToken = (token: string) => {
  return new Promise<IUser>((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as IUser);
    });
  });
};

export const register: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .send({ error: 'Email, password, and name is required' });
  }
  try {
    const user = await User.create({ email, password, name });
    const token = makeToken(user);
    return res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const login: RequestHandler = async (req, res) => {};
