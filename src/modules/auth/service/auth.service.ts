import { userQueryRepository } from '../../users/repository/user-query.repository';
import { bcryptService } from '../../../shared/utils/bcrypt-service';
import { jwtService } from '../../../shared/utils/jwt-service';

export const authService = {
  async loginUser(loginData: { loginOrEmail: string; password: string }) {
    const findUser = await userQueryRepository.getUserByLoginOrEmail(loginData.loginOrEmail);
    if (!findUser) {
      throw 'User not found';
    }
    const isMatchesUserPassword = await bcryptService.compareHash(
      loginData.password,
      findUser.passwordHash,
    );
    const accessToken = await jwtService.createToken(findUser._id.toString());
    if (isMatchesUserPassword && accessToken) {
      return accessToken;
    } else {
      return null;
    }
  },
};
