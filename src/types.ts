import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
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

export type CoinAuthResponse = {
  token?: string;
  error?: string;
};
