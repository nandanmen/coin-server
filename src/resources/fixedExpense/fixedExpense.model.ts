import { Schema, model } from 'mongoose';
import { IFixedExpense } from 'types';

export const fixedExpenseSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  due: Date,
  payableTo: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<IFixedExpense>('FixedExpense', fixedExpenseSchema);
