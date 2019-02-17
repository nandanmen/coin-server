import { Document, Types, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

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
  check: (pass: string) => Promise<Boolean>;
}

export interface IFixedExpense extends Document {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  due?: Date;
  payableTo?: string;
  createdBy: Types.ObjectId;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  budget: number;
  createdBy: Types.ObjectId;
}

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  vendor: string;
  amount: number;
  date: Date;
  category: Types.ObjectId;
  createdBy: Types.ObjectId;
}

export type CoinModel = Model<
  IUser | IFixedExpense | ICategory | ITransaction,
  {}
>;

export type CoinRequestHandler = (
  req: CoinRequest,
  res: CoinResponse,
  next: NextFunction
) => any;

export interface CoinRequest extends Request {
  user?: IUser;
}

export interface CoinResponse extends Response {
  error?: string;
  data?: IUser | IFixedExpense | ICategory | ITransaction;
}

export type CoinAuthResponse = {
  token?: string;
  error?: string;
};
