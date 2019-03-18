import makeControllers from '../../utils/controllers';
import Category from './category.model';
import Transaction from '../transaction/transaction.model';
import { CoinRequestHandler, ICategory, ITransaction } from 'types';

const controllers = makeControllers(Category);

const getOne: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const _id = req.params.id;
    const ctg = await Category.findOne({ createdBy: user._id, _id })
      .lean()
      .exec();

    if (!ctg) {
      return res.status(404).send({ error: 'Document not found' });
    }

    const transactions: ITransaction[] = await Transaction.find({
      category: ctg._id,
      createdBy: user._id,
    })
      .lean()
      .exec();
    ctg.spent = transactions.reduce((acc, tr) => acc + tr.amount, 0);

    res.status(200).send({ data: ctg });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

const getMany: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const docs: ICategory[] = await Category.find({ createdBy: user._id })
      .lean()
      .select('name budget spent')
      .exec();

    const promises = docs.map(async ctg => {
      const transactions: ITransaction[] = await Transaction.find({
        category: ctg._id,
        createdBy: user._id,
      })
        .lean()
        .exec();
      ctg.spent = transactions.reduce((acc, tr) => acc + tr.amount, 0);
    });

    await Promise.all(promises);
    res.status(200).send({ data: docs });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

controllers.getOne = getOne;
controllers.getMany = getMany;

export default controllers;
