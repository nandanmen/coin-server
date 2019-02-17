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
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

export const getMany = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  try {
    const user = req.user;
    const docs = await model
      .find({ createdBy: user._id })
      .lean()
      .exec();

    res.status(200).send({ data: docs });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

export const create = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  try {
    const user = req.user;
    let fields = req.body;
    fields = {
      ...fields,
      createdBy: user._id,
    };

    const doc = await model.create(fields);
    res.status(201).send({ data: doc });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

export const update = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  try {
    const user = req.user;
    const _id = req.params.id;
    const update = req.body;
    const document = await model
      .findOneAndUpdate({ createdBy: user._id, _id }, update, { new: true })
      .lean()
      .exec();

    if (!document) {
      return res.status(404).send({ error: 'Document not found' });
    }

    res.status(201).send({ data: document });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

export const delOne = (model: CoinModel): CoinRequestHandler => async (
  req,
  res
) => {
  try {
    const user = req.user;
    const _id = req.params.id;
    const document = await model
      .findOneAndDelete({ createdBy: user._id, _id })
      .lean()
      .exec();

    if (!document) {
      return res.status(404).send({ error: 'Document not found' });
    }

    res.status(200).send({ data: document });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

export default (model: CoinModel) => ({
  getOne: getOne(model),
  getMany: getMany(model),
  create: create(model),
  update: update(model),
  delOne: delOne(model),
});
