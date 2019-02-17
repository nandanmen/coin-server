import { Schema, model } from 'mongoose';
import { ITransaction } from 'types';

export const transactionSchema = new Schema({
  vendor: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<ITransaction>('Transaction', transactionSchema);
