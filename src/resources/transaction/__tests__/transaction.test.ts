import * as Moment from 'moment';
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

      const req = { user: { _id: user }, query: {} } as CoinRequest;
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

    test('gets all transactions from a specific category', async () => {
      const user = makeID();
      const category = 'food';

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
      const total = transactions
        .filter(tr => tr.category.toHexString() === food._id.toHexString())
        .reduce((acc, tr) => acc + tr.amount, 0);

      const req = {
        user: { _id: user },
        query: { category },
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
            expect(transaction.category.toHexString()).toEqual(
              food._id.toHexString()
            );
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
      const vendor = 'Nero waffle';

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
      const total = transactions
        .filter(tr => tr.vendor === vendor)
        .reduce((acc, tr) => acc + tr.amount, 0);

      const req = {
        user: { _id: user },
        query: { vendor },
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

    test('gets all transactions in an amount range', async () => {
      const user = makeID();
      const moreThan = 10;
      const lessThan = 60;

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
          amount: 5.25,
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
          vendor: 'Gyu teppanyaki',
          amount: 95.0,
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
      const total = transactions
        .filter(tr => tr.amount >= moreThan && tr.amount <= lessThan)
        .reduce((acc, tr) => acc + tr.amount, 0);

      const req = {
        user: { _id: user },
        query: { moreThan, lessThan },
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
            expect(transaction.amount).toBeGreaterThanOrEqual(moreThan);
            expect(transaction.amount).toBeLessThanOrEqual(lessThan);
            expect(transaction.createdBy.toHexString()).toEqual(
              user.toHexString()
            );
          });
        },
      } as CoinResponse;

      await getMany(req, res, () => {});
    });

    test('gets all transactions in a date range', async () => {
      const user = makeID();
      const options = { after: '2019-02-15', before: '2019-02-16' };

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
          amount: 5.25,
          date: Moment('2019-02-17').toDate(),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Nero waffle',
          amount: 10.94,
          date: Moment('2019-02-16').toDate(),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Gyu teppanyaki',
          amount: 95.0,
          date: Moment('2019-02-14').toDate(),
          category: food._id,
          createdBy: user,
        },
        {
          vendor: 'Shell',
          amount: 50.0,
          date: Moment('2019-02-15').toDate(),
          category: gas._id,
          createdBy: user,
        },
      ]);
      const total = transactions
        .filter(tr => {
          const date = Moment(tr.date);
          return date.isBetween(options.after, options.before, null, '[]');
        })
        .reduce((acc, tr) => acc + tr.amount, 0);

      const req = {
        user: { _id: user },
        query: { ...options },
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
          data.forEach(tr => {
            const date = Moment(tr.date);
            expect(
              date.isBetween(options.after, options.before, null, '[]')
            ).toBeTruthy();
            expect(tr.createdBy.toHexString()).toEqual(user.toHexString());
          });
        },
      } as CoinResponse;

      await getMany(req, res, () => {});
    });
  });
});
