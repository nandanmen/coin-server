import { Document, Types } from 'mongoose';
import { Request } from 'express';

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
  check: (pass: string) => Promise<Boolean>;
}

export type CoinAuthResponse = {
  token?: string;
  error?: string;
};

export interface CoinRequest extends Request {
  user?: IUser;
}
