import { getMe, updateMe } from '../user.controllers';
import { IUser, CoinRequest, CoinResponse } from 'types';
import User from '../user.model';

describe('user', () => {
  describe('get', () => {
    test('returns self', async () => {
      const user = await User.create({
        email: 'hello@hello.com',
        password: 'abcd',
        name: 'John Doe',
      });

      const req = {
        user: { _id: user._id },
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const data: IUser = msg.data;
          expect(data._id.toHexString()).toEqual(user._id.toHexString());
        },
      } as CoinResponse;

      await getMe(req, res, () => {});
    });
  });

  describe('update', () => {
    test('updates and returns new user', async () => {
      const user = await User.create({
        email: 'hello@hello.com',
        password: 'abcd',
        name: 'John Doe',
      });
      const fields = { email: 'hello@example.com' };

      const req = {
        user: { _id: user._id },
        body: fields,
      } as CoinRequest;
      const res = {
        status(code: number) {
          expect(code).toBe(200);
          return this;
        },
        send(msg: any) {
          const data: IUser = msg.data;
          expect(data._id.toHexString()).toEqual(user._id.toHexString());
          expect(data.email).toEqual(fields.email);
        },
      } as CoinResponse;

      await updateMe(req, res, () => {});
    });
  });
});
