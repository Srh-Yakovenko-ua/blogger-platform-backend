import { userQueryRepository } from '../../users/repository/user-query.repository';
import { bcryptService } from '../../../shared/utils/bcrypt-service';

export const authService = {
  async loginUser(loginData: { loginOrEmail: string; password: string }) {
    const findUser = await userQueryRepository.getUserByLoginOrEmail(loginData.loginOrEmail);
    if (!findUser) {
      throw 'User not found';
    }
    return await bcryptService.compareHash(loginData.password, findUser.passwordHash);
  },
};
