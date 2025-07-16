import { UserDBType } from '../types/user-types';
import { WithId } from 'mongodb';

import { userQueryRepository } from '../repository/user-query.repository';

export const userQueryService = {
  async getUserByID(userID: string): Promise<WithId<UserDBType> | null> {
    return await userQueryRepository.getUserByID(userID);
  },
};
