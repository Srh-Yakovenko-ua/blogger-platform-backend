import { usersCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, WithId } from 'mongodb';
import { UserDBType } from '../types/user-types';

export const userRepository = {
  async createUser(createData: UserDBType): Promise<InsertOneResult<UserDBType>> {
    return await usersCollections.insertOne(createData);
  },
  async existsByLoginOrEmail(login: string, email: string): Promise<WithId<UserDBType> | null> {
    return usersCollections.findOne(
      { $or: [{ login }, { email }] },
      { projection: { login: 1, email: 1 } },
    );
  },
};
