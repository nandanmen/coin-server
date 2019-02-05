import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ITransaction extends mongoose.Document {
  _id: number;
  vendor: string;
  amount: number;
  date: Date;
  user: number;
}

export const TransactionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  vendor: String,
  amount: Number,
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
