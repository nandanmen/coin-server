import { CoinRequestHandler } from 'types';
import User from './user.model';

export const getMe: CoinRequestHandler = (req, res) => {
  res.status(200).send({ data: req.user });
};

export const updateMe: CoinRequestHandler = async (req, res) => {
  try {
    const me = req.user;
    const update = req.body;
    const user = await User.findOneAndUpdate({ id: me.id }, update, {
      new: true,
    })
      .select('-password')
      .lean()
      .exec();

    res.status(200).send({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};
