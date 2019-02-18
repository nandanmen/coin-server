import * as mongoose from 'mongoose';
import * as Moment from 'moment';
import { GetTransactionOptions, IUser, GetTransactionSelector } from 'types';
import Category from '../resources/category/category.model';

export const makeID = () => mongoose.Types.ObjectId();

export const getSelector = async (
  user: IUser,
  options: GetTransactionOptions
) => {
  const { vendor, category, amountRange, from, to } = options;
  let result: GetTransactionSelector = {};

  if (vendor) result.vendor = vendor;

  if (category) {
    const ctg = await Category.findOne({ name: category, createdBy: user._id });
    if (ctg) result.category = ctg._id;
  }

  if (amountRange) {
    const min = amountRange[0];
    const max = amountRange[1];
    if (!max) {
      result.amount = { $lte: min };
    } else {
      result.amount = { $gte: min, $lte: max };
    }
  }

  if (from) result.date = { $gte: Moment(from).toDate() };
  if (to) result.date.$lte = Moment(to).toDate();

  return result;
};
