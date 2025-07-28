import { UserDBType, UserPaginationSearchesType, UserType } from '../types/user-types';
import { WithId } from 'mongodb';

import { userQueryRepository } from '../repository/user-query.repository';
import { PaginationQueryType } from '../../../shared/types/pagination-query-type';
import { userMapToViewModel } from '../utils/user-map-to-view-model';

export const userQueryService = {
  async getUserByID(userID: string): Promise<UserType | null> {
    const findUser = await userQueryRepository.getUserByID(userID);
    if (findUser) return userMapToViewModel(findUser);
    else return null;
  },
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
    return await userQueryRepository.getUserByLoginOrEmail(loginOrEmail);
  },

  async getUsers(filters: PaginationQueryType & UserPaginationSearchesType) {
    const { users, totalCount } = await userQueryRepository.getUsers(filters);

    const mapToOutputUsersLists = (findUsers: WithId<UserDBType>[], totalCount: number) => {
      return {
        totalCount: totalCount,
        pagesCount: Math.ceil(totalCount / filters.pageSize) || 1,
        page: filters.pageNumber,
        pageSize: filters.pageSize,
        items: findUsers.map(userMapToViewModel),
      };
    };

    return mapToOutputUsersLists(users, totalCount);
  },
};
