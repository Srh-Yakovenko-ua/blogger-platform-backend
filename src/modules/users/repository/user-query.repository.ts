import { Filter, ObjectId, WithId } from 'mongodb';
import { UserDBType, UserPaginationSearchesType } from '../types/user-types';
import { usersCollections } from '../../../setup/setup-mongo-db';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';

export const userQueryRepository = {
  async getUserByID(userID: string): Promise<WithId<UserDBType> | null> {
    const objectID = new ObjectId(userID);
    return usersCollections.findOne({ _id: objectID });
  },

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
    return usersCollections.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  async getUsers(filters: PaginationQueryType & UserPaginationSearchesType): Promise<{
    users: WithId<UserDBType>[];
    totalCount: number;
  }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } =
      filters;

    const skip = (pageNumber - 1) * pageSize;

    const orFilters: Filter<UserDBType>[] = [];
    if (searchLoginTerm) {
      orFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }
    if (searchEmailTerm) {
      orFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }
    const filter: Filter<UserDBType> = orFilters.length > 0 ? { $or: orFilters } : {};

    const findUsers = await usersCollections
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollections.countDocuments(filter);

    return { users: findUsers, totalCount };
  },
};
