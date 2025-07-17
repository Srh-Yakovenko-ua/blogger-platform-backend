import { UserType } from '../types/user-types';
import { WithId } from 'mongodb';

export const userMapToViewModel = (user: WithId<UserType>): UserType => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
