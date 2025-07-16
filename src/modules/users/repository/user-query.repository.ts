import { ObjectId, WithId } from 'mongodb';
import { UserDBType } from '../types/user-types';
import { usersCollections } from '../../../setup/setup-mongo-db';

export const userQueryRepository = {
  async getUserByID(userID: string): Promise<WithId<UserDBType> | null> {
    const objectID = new ObjectId(userID);
    return usersCollections.findOne({ _id: objectID });
  },
};
