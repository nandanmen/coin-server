import { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
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
      _id: Types.ObjectId;
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
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
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

export default model<IUser>('User', UserSchema);
