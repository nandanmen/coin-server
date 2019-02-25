import Transaction from './transaction.model';
import Category from '../category/category.model';
import { CoinRequestHandler, GetTransactionOptions, ITransaction } from 'types';
import { getSelector } from '../../utils/helpers';
import makeControllers from '../../utils/controllers';

const controllers: any = makeControllers(Transaction);

export const getMany: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const options: GetTransactionOptions = req.query;
    const selector = await getSelector(user, options);
    const { max } = options;

    const query = Transaction.find({
      createdBy: user._id,
      ...selector,
    });
    if (max) query.limit(max);

    const docs: ITransaction[] = await query.lean().exec();
    const total = docs.reduce((acc, tr) => acc + tr.amount, 0);

    res.status(200).send({ total, options, data: docs });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

const create: CoinRequestHandler = async (req, res) => {
  try {
    const { vendor, amount, date, category } = req.body;

    if (!vendor || !amount || !category) {
      return res
        .status(400)
        .send({ error: 'Vendor, amount and category fields are required' });
    }
    let ctg = await Category.findOne({ name: category });
    if (!ctg) {
      return res
        .status(400)
        .send({ error: `Category ${category} does not exist` });
    }

    const fields = {
      vendor,
      amount,
      date,
      category: ctg._id,
      createdBy: req.user._id,
    };

    const tr = await Transaction.create(fields);
    res.status(201).send({ data: tr });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

const getVendors: CoinRequestHandler = async (req, res) => {
  try {
    const trs: ITransaction[] = await Transaction.find({
      createdBy: req.user._id,
    })
      .lean()
      .exec();
    const vendors = new Set(trs.map(tr => tr.vendor));
    const uniqueVendors = Array.from(vendors);
    res.status(201).send({ data: uniqueVendors });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

controllers.getMany = getMany;
controllers.create = create;
controllers.getVendors = getVendors;

export default controllers;
