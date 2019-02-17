import * as mongoose from 'mongoose';
import { GetTransactionOptions, IUser, GetTransactionSelector } from 'types';
import Category from '../resources/category/category.model';

export const makeID = () => mongoose.Types.ObjectId();

export const getSelector = async (
  user: IUser,
  options: GetTransactionOptions
) => {
  const { vendor, category, amountRange, from, to } = options;
  let result: GetTransactionSelector = { vendor };

  if (category) {
    const ctg = await Category.findOne({ name: category, createdBy: user._id });
    if (ctg) result.category = ctg._id;
  }

  if (amountRange) {
    const min = amountRange[0];
    const max = amountRange[1];
    if (!max) {
      result.amount = { $lt: min };
    } else {
      result.amount = { $gt: min, $lt: max };
    }
  }

  if (from) result.date = { $gt: new Date(from) };
  if (to) result.date.$lt = new Date(to);

  return result;
};
