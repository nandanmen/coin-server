import * as jwt from 'jsonwebtoken';
import config from '../config';
import { RequestHandler } from 'express';
import { IUser, CoinRequest } from '../types';
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
  const goalDefault = {
    goal: '',
    funds: 0,
    amount: 0,
    payment: 0,
  };
  const { email, password, name, income = 0, goal = goalDefault } = req.body;

  if (!email || !password || !name) {
    if (email) {
      const user = await User.findOne({ email });
      if (user)
        return res.status(400).send({ error: 'Oops, that email was taken.' });
      return res.status(200).end();
    }
    return res
      .status(400)
      .send({ error: 'Email, password, and name is required' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) res.status(400).send({ error: 'That email was taken.' });

    user = await User.create({ email, password, name, income, goal });
    const token = makeToken(user);
    return res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: 'Email, and password is required' });
  }
  try {
    const user = await User.findOne({ email })
      .select('email password')
      .exec();

    if (!user) {
      return res.status(404).send({ error: 'Incorrect email or password' });
    }

    const isValid = await user.check(password);
    if (!isValid) {
      return res.status(401).send({ error: `Incorrect email or password` });
    }

    const token = makeToken(user);
    res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const protect: RequestHandler = async (req: CoinRequest, res, next) => {
  const error = 'Not authorized';

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).send({ error });
  }

  const token = auth.split('Bearer ')[1];
  let user = await verifyToken(token);
  user = await User.findById(user.id)
    .select('-password')
    .lean()
    .exec();

  if (!user) {
    return res.status(401).send({ error });
  }

  req.user = user;
  next();
};
