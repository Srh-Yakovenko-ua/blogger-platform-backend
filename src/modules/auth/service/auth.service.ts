import { userQueryRepository } from '../../users/repository/user-query.repository';
import { bcryptService } from '../../../shared/utils/bcrypt-service';
import { jwtService } from '../../../shared/utils/jwt-service';
import { RegistrationCreateDto } from '../types/registration-create-dto';
import { randomUUID } from 'crypto';
import { UserDBType } from '../../users/types/user-types';
import { add } from 'date-fns';
import { userRepository } from '../../users/repository/user.repository';
import { emailServices } from '../../../shared/utils/email-services';
import { userService } from '../../users/service/user.service';
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
    if (!isMatchesUserPassword) {
      throw 'If the password or login or email is wrong';
    }
    const accessToken = await jwtService.createToken(findUser._id.toString());
    if (accessToken) return accessToken;
    else return null;
  },

  async registrationUser(data: RegistrationCreateDto) {
    const conflict = await userRepository.existsByLoginOrEmail(data.login, data.email);

    if (conflict) throw data.login === conflict.login ? 'login' : 'email';

    const passwordSalt = await bcryptService.createSalt();
    const passwordHash = await bcryptService.generateHash(data.password, passwordSalt);

    const newUser: UserDBType = {
      login: data.login,
      passwordHash,
      email: data.email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    await userRepository.createUser(newUser);

    try {
      await emailServices.sendConfirmationCode({
        toEmail: data.email,
        code: newUser.emailConfirmation!.confirmationCode,
      });
    } catch (err) {
      console.error('Send email error', err);
    }

    return newUser;
  },

  async resendingEmailVerificationCode(email: string) {
    const findUser = await userQueryRepository.getUserByLoginOrEmail(email);
    if (!findUser) throw 'User not Found';

    const newCode = randomUUID();
    await userService.updateUser(findUser._id.toString(), {
      'emailConfirmation.confirmationCode': newCode,
    });

    try {
      await emailServices.sendConfirmationCode({
        toEmail: email,
        code: newCode,
      });
    } catch (err) {
      console.error('Send email error', err);
    }
  },

  async confirmationUser(code: string) {
    async function isValidUUID(code: string): Promise<boolean> {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidPattern.test(code);
    }
    const isNotValid = await isValidUUID(code);
    if (!isNotValid) throw 'Code not Valid';
    function isExpiredCode(expirationDate: Date | undefined): boolean {
      if (!expirationDate) return false;
      return Date.now() > expirationDate.getTime();
    }
    const findUser = await userQueryRepository.getUserByConfirmationCode(code);
    if (!findUser) {
      throw 'User not found';
    }
    const isExpired = isExpiredCode(findUser.emailConfirmation?.expirationDate);

    const hasBeenApplied = findUser.emailConfirmation?.isConfirmed === true;
    if (isExpired) throw 'Code expired';

    if (hasBeenApplied) throw 'Code Already Applied';

    return await userService.updateUser(findUser._id.toString(), {
      'emailConfirmation.isConfirmed': true,
    });
  },
};
