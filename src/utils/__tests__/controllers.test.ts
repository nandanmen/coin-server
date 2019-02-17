import { getOne, getMany, create, update, delOne } from '../controllers';
import { makeID } from '../helpers';
import Category from '../../resources/category/category.model';
import { CoinRequest, CoinResponse, IUser, ICategory } from 'types';

process.env.TEST_SUITE = 'controller-tests';

describe('crud controllers', () => {
  describe('get one', () => {
    test('404 if document does not exist', async () => {
      expect.assertions(2);

      const user = makeID();

      const req = {
        user: { _id: user } as IUser,
        params: {
          id: makeID(),
        },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(404);
          return this;
        },
        send(msg: any) {
          expect(msg.error).toBe('Document not found');
        },
      } as CoinResponse;

      await getOne(Category)(req, res, () => {});
    });

    test('returns correct document', async () => {
      expect.assertions(2);

      const user = makeID();
      const ctg = await Category.create({
        name: 'Groceries',
        budget: 300,
        createdBy: user,
      });

      const req = {
        user: { _id: user } as IUser,
        params: {
          id: ctg._id,
        },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const data: ICategory = msg.data;
          expect(data._id.toHexString()).toBe(ctg._id.toHexString());
        },
      } as CoinResponse;

      await getOne(Category)(req, res, () => {});
    });
  });

  describe('get many', () => {
    test('returns array of docs', async () => {
      const user = makeID();
      await Category.create([
        {
          name: 'Groceries',
          budget: 300,
          createdBy: user,
        },
        {
          name: 'Shopping',
          budget: 250,
          createdBy: user,
        },
      ]);

      const req = {
        user: { _id: user } as IUser,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const data: ICategory[] = msg.data;
          expect(data).toHaveLength(2);
          data.forEach(doc =>
            expect(doc.createdBy.toHexString()).toEqual(user.toHexString())
          );
        },
      } as CoinResponse;

      await getMany(Category)(req, res, () => {});
    });
  });

  describe('create', () => {
    test('creates a new document', async () => {
      expect.assertions(3);

      const user = makeID();
      const newCtg = {
        name: 'Gas',
        budget: 200,
      };

      const req = {
        user: { _id: user } as IUser,
        body: newCtg,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(201);
          return this;
        },
        send(msg: any) {
          const data: ICategory = msg.data;
          expect(data.name).toBe(newCtg.name);
          expect(data.budget).toBe(newCtg.budget);
        },
      } as CoinResponse;

      await create(Category)(req, res, () => {});
    });

    test('createdBy set to correct user', async () => {
      expect.assertions(2);

      const user = makeID();
      const newCtg = {
        name: 'Gas',
        budget: 200,
      };

      const req = {
        user: { _id: user } as IUser,
        body: newCtg,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(201);
          return this;
        },
        send(msg: any) {
          const data: ICategory = msg.data;
          expect(data.createdBy.toHexString()).toBe(user.toHexString());
        },
      } as CoinResponse;

      await create(Category)(req, res, () => {});
    });
  });

  describe('update', () => {
    test('404 if document not found', async () => {
      expect.assertions(2);

      const user = makeID();
      const req = {
        params: { id: makeID() },
        user: { _id: user } as IUser,
        body: { budget: 250 },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(404);
          return this;
        },
        send(msg: any) {
          expect(msg.error).toBe('Document not found');
        },
      } as CoinResponse;

      await update(Category)(req, res, () => {});
    });

    test('finds and updates document', async () => {
      expect.assertions(3);

      const user = makeID();
      const ctg = await Category.create({
        name: 'Gas',
        budget: 200,
        createdBy: user,
      });

      const req = {
        params: { id: ctg._id },
        user: { _id: user } as IUser,
        body: { budget: 250 },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(201);
          return this;
        },
        send(msg: any) {
          const data: ICategory = msg.data;
          expect(data._id.toHexString()).toBe(ctg._id.toHexString());
          expect(data.budget).toBe(250);
        },
      } as CoinResponse;

      await update(Category)(req, res, () => {});
    });
  });

  describe('delete', () => {
    test('404 if document not found', async () => {
      expect.assertions(2);

      const user = makeID();
      const req = {
        params: { id: makeID() },
        user: { _id: user } as IUser,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(404);
          return this;
        },
        send(msg: any) {
          expect(msg.error).toBe('Document not found');
        },
      } as CoinResponse;

      await delOne(Category)(req, res, () => {});
    });

    test('deletes document', async () => {
      expect.assertions(3);

      const user = makeID();
      const ctg = await Category.create({
        name: 'Gas',
        budget: 200,
        createdBy: user,
      });

      const req = {
        params: { id: ctg._id },
        user: { _id: user } as IUser,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const data: ICategory = msg.data;
          expect(data._id.toHexString()).toBe(ctg._id.toHexString());
        },
      } as CoinResponse;

      await delOne(Category)(req, res, () => {});

      const saved = await Category.findById(ctg._id)
        .lean()
        .exec();
      expect(saved).toBeFalsy();
    });
  });
});
