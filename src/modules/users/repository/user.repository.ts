import { usersCollections } from '../../../setup/setup-mongo-db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
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

  async deleteUser(userID: string) {
    const mongoObjectID = new ObjectId(userID);
    const removeUserResult = await usersCollections.deleteOne({ _id: mongoObjectID });
    return removeUserResult.deletedCount >= 1;
  },

  async updateUser(userId: string, updateData: Record<string, any>) {
    const mongoObjectID = new ObjectId(userId);
    const updatePostResult = await usersCollections.updateOne(
      { _id: mongoObjectID },
      { $set: updateData },
    );
    return updatePostResult.matchedCount >= 1;
  },
};
