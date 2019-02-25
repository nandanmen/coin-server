import makeControllers from '../../utils/controllers';
import Category from './category.model';
import { CoinRequestHandler } from 'types';

const controllers = makeControllers(Category);

const create: CoinRequestHandler = async (req, res) => {
  try {
    const { name, budget } = req.body;
    if (!name || !budget) throw new Error('Name and budget is required');

    const ctg = await Category.findOne({ name, createdBy: req.user._id });
    if (ctg) throw new Error('That category already exists');

    const doc = await Category.create({
      name,
      budget,
      createdBy: req.user._id,
    });
    res.status(201).send({ data: doc });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

controllers.create = create;

export default controllers;
