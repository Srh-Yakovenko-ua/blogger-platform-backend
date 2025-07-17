import { UserType } from '../types/user-types';
import { WithId } from 'mongodb';

export const userMapToViewModel = (user: WithId<UserType>): UserType => {
  return {
    createdAt: user.createdAt,
    login: user.login,
    id: user._id.toString(),
    email: user.email,
  };
};
