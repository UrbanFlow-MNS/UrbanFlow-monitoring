import { Repository } from 'typeorm';

export type MockRepository<T = object> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = object>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
