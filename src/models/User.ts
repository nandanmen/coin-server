import * as mongoose from 'mongoose';
import { ObjectId } from 'bson';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
      name: String,
      amount: Number,
      due: String,
      payable: String,
    },
  ],
  categories: [
    {
      name: String,
      amount: Number,
      transactions: [
        {
          vendor: String,
          amount: Number,
          date: String,
        },
      ],
    },
  ],
});

export default mongoose.model('User', UserSchema);
