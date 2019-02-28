import makeControllers from '../../utils/controllers';
import Category from './category.model';
import Transaction from '../transaction/transaction.model';
import { CoinRequestHandler, ICategory, ITransaction } from 'types';

const controllers = makeControllers(Category);

const getMany: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const docs: ICategory[] = await Category.find({ createdBy: user._id })
      .lean()
      .exec();

    docs.map(async ctg => {
      const transactions: ITransaction[] = await Transaction.find({
        category: ctg._id,
        createdBy: user._id,
      })
        .lean()
        .exec();
      ctg.spent = transactions.reduce((acc, tr) => acc + tr.amount, 0);
    });

    res.status(200).send({ data: docs });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

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

controllers.getMany = getMany;
controllers.create = create;

export default controllers;
