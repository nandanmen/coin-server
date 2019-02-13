import { Document, Schema, Types, model } from 'mongoose';

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  vendor: string;
  amount: number;
  date: Date;
  user: Types.ObjectId;
}

export const TransactionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  vendor: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model<ITransaction>('Transaction', TransactionSchema);
