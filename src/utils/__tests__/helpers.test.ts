import { getSelector, makeID } from '../helpers';
import Category from '../../resources/category/category.model';
import { IUser } from 'types';

describe('getSelector', () => {
  test('converts category name to id', async () => {
    const user = makeID();
    const ctg = await Category.create({
      name: 'Shopping',
      budget: 150,
      createdBy: user,
    });

    const selector = await getSelector({ _id: user } as IUser, {
      category: 'Shopping',
    });

    expect(selector.category.toHexString()).toEqual(ctg._id.toHexString());
  });

  test('converts amount range with one element', async () => {
    const user = makeID();
    const selector = await getSelector({ _id: user } as IUser, {
      amountRange: [100],
    });

    const savedRange = selector.amount;
    expect(savedRange.$lt).toBe(100);
    expect(savedRange).not.toHaveProperty('$gt');
  });

  test('converts amount range', async () => {
    const user = makeID();
    const selector = await getSelector({ _id: user } as IUser, {
      amountRange: [100, 300],
    });

    const savedRange = selector.amount;
    expect(savedRange.$lt).toBe(300);
    expect(savedRange.$gt).toBe(100);
  });

  test('converts date range', async () => {
    const user = makeID();
    const selector = await getSelector({ _id: user } as IUser, {
      from: '10 Jan 2019',
      to: '10 Feb 2019',
    });

    const savedRange = selector.date;
    expect(savedRange.$lt.toDateString()).toEqual(
      new Date('10 Feb 2019').toDateString()
    );
    expect(savedRange.$gt.toDateString()).toEqual(
      new Date('10 Jan 2019').toDateString()
    );
  });

  test('converts options to selector', async () => {
    const user = makeID();
    const food = await Category.create({
      name: 'Food',
      budget: 300,
      createdBy: user,
    });

    const options = {
      vendor: 'Starbucks',
      category: 'Food',
      amountRange: [10, 20],
      from: '10 Feb 2019',
      to: '10 April 2019',
    };

    const selector = await getSelector({ _id: user } as IUser, options);
    const expectedSelector = {
      vendor: options.vendor,
      category: food._id,
      amount: { $gt: options.amountRange[0], $lt: options.amountRange[1] },
      date: { $gt: new Date(options.from), $lt: new Date(options.to) },
    };

    expect(selector).toEqual(expectedSelector);
  });
});
