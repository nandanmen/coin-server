import Transaction from './transaction.model';
import { CoinRequestHandler, GetTransactionOptions } from 'types';
import { getSelector } from '../../utils/helpers';
import makeControllers from '../../utils/controllers';

const controllers = makeControllers(Transaction);

const getMany: CoinRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const options: GetTransactionOptions = req.body;
    const selector = await getSelector(user, options);
    const { max } = options;

    const query = Transaction.find({ ...selector, createdBy: user._id });
    if (max) query.limit(max);

    const docs = await query.lean().exec();

    res.status(200).send({ data: docs });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error });
  }
};

controllers.getMany = getMany;

export default controllers;
