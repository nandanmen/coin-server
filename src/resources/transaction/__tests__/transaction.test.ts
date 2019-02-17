import { CoinRequest, ITransaction, CoinResponse } from 'types';
import { makeID } from '../../../utils/helpers';
import { getMany } from '../transaction.controllers';
import Transaction from '../transaction.model';
import Category from '../../category/category.model';

process.env.TEST_SUITE = 'transaction-tests';

describe('transactions', () => {
  describe('getMany', () => {
    test('gets all transactions', async () => {
      const user = makeID();

      const food = await Category.create({
        name: 'food',
        budget: 500,
        createdBy: user,
      });
      const gas = await Category.create({
        name: 'gas',
        budget: 250,
        createdBy: user,
      });
      const transactions = await Transaction.create([
        {
          vendor: 'BBT Shop',
          amount: 10.75,
          date: new Date('17 Feb'),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Nero waffle',
          amount: 10.94,
          date: new Date('16 Feb'),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Shell',
          amount: 50.0,
          date: new Date('16 Feb'),
          category: gas._id,
          createdBy: user,
        },
      ]);
      const total = transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );

      const req = { user: { _id: user }, body: {} } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const savedTotal = msg.total;
          expect(savedTotal).toBe(total);

          const data: ITransaction[] = msg.data;
          expect(data).toHaveLength(3);
          data.forEach(transaction => {
            expect(transaction.createdBy.toHexString()).toEqual(
              user.toHexString()
            );
          });
        },
      } as CoinResponse;

      await getMany(req, res, () => {});
    });

    test('gets all transactions from a specific vendor', async () => {
      const user = makeID();

      const food = await Category.create({
        name: 'food',
        budget: 500,
        createdBy: user,
      });
      const gas = await Category.create({
        name: 'gas',
        budget: 250,
        createdBy: user,
      });
      const transactions = await Transaction.create([
        {
          vendor: 'BBT Shop',
          amount: 10.75,
          date: new Date('17 Feb'),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Nero waffle',
          amount: 10.94,
          date: new Date('16 Feb'),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Nero waffle',
          amount: 10.94,
          date: new Date('15 Feb'),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Shell',
          amount: 50.0,
          date: new Date('16 Feb'),
          category: gas._id,
          createdBy: user,
        },
      ]);

      const vendor = 'Nero waffle';
      const filtered = transactions.filter(tr => tr.vendor === vendor);
      const total = filtered.reduce((acc, tr) => acc + tr.amount, 0);

      const req = {
        user: { _id: user },
        body: { vendor },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const savedTotal = msg.total;
          expect(savedTotal).toEqual(total);

          const data: ITransaction[] = msg.data;
          data.forEach(transaction => {
            expect(transaction.vendor).toEqual(vendor);
            expect(transaction.createdBy.toHexString()).toEqual(
              user.toHexString()
            );
          });
        },
      } as CoinResponse;

      await getMany(req, res, () => {});
    });
  });
});
