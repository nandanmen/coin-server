import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  name: string;
  income?: number;
  goal?: {
    funds: number;
    goal: number;
    due: string;
  };
  fixedExpenses?: [
    {
      _id: mongoose.Types.ObjectId;
      name: string;
      amount: number;
      due: Date;
      payable: string;
    }
  ];
  categories?: [
    {
      name: string;
      amount: number;
    }
  ];
}

export const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  password: String,
  name: String,
  income: Number,
  goal: {
    funds: Number,
    goal: Number,
    due: String,
  },
  fixedExpenses: [
    {
      _id: Schema.Types.ObjectId,
      name: String,
      amount: Number,
      due: Date,
      payable: String,
    },
  ],
  categories: [
    {
      name: String,
      amount: Number,
    },
  ],
});

export default mongoose.model<IUser>('User', UserSchema);
