import { CoinModel, CoinRequestHandler } from 'types';

export const getOne = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  try {
    const user = req.user;
    const _id = req.params.id;
    const document = await model
      .findOne({ createdBy: user._id, _id })
      .lean()
      .exec();

    if (!document) {
      return res.status(404).send({ error: 'Document not found' });
    }

    res.status(200).send({ data: document });
  } catch (e) {
    console.error(e);
    return res.status(400).send({ error: e });
  }
};

export const getMany = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  res.end();
};

export const create = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  res.end();
};

export const update = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  res.end();
};

export const delOne = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  res.end();
};

export default (model: CoinModel) => ({
  getOne: getOne(model),
  getMany: getMany(model),
  create: create(model),
  update: update(model),
  delOne: delOne(model),
});
