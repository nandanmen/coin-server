import Transaction from './transaction.model';
import { CoinRequestHandler, GetTransactionOptions, ITransaction } from 'types';
import { getSelector } from '../../utils/helpers';
import makeControllers from '../../utils/controllers';

const controllers = makeControllers(Transaction);

export const getMany: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const options: GetTransactionOptions = req.body;
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

controllers.getMany = getMany;

export default controllers;
