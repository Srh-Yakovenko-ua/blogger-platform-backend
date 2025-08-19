import { userRepository } from '../repository/user.repository';
import { CreateUserDTO, UserDBType } from '../types/user-types';
import { bcryptService } from '../../../shared/utils/bcrypt-service';

export const userService = {
  async createUser(data: CreateUserDTO): Promise<string> {
    const conflict = await userRepository.existsByLoginOrEmail(data.login, data.email);
    if (conflict) {
      throw conflict.login === data.login ? 'login' : 'email';
    }
    const createdAt = new Date().toISOString();
    const salt = await bcryptService.createSalt();
    const hash = await bcryptService.generateHash(data.password, salt);

    const userToInsert: UserDBType = {
      login: data.login,
      email: data.email,
      createdAt: createdAt,
      passwordHash: hash,
      emailConfirmation: null,
      currentRefreshToken: null,
    };

    const newUser = await userRepository.createUser(userToInsert);
    return newUser.insertedId.toString();
  },

  async updateUser(userId: string, updateData: Record<string, any>) {
    return await userRepository.updateUser(userId, updateData);
  },

  async deleteUser(userID: string) {
    return await userRepository.deleteUser(userID);
  },
};
