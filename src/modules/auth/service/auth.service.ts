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
import { ResultFactory } from '../../../shared/utils/result-factory';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { getClientIp } from '../../../shared/utils/get-client-ip';
import { Request } from 'express';
import { DeviceSessionDBType } from '../../device-sessions/types/device-sessions-types';
import { deviceSessionsRepository } from '../../device-sessions/repository/device-sessions-repository';
import { deviceSessionsCollections } from '../../../setup/setup-mongo-db';

export const authService = {
  async loginUser(loginData: { loginOrEmail: string; password: string }, req: Request) {
    const findUser = await userQueryRepository.getUserByLoginOrEmail(loginData.loginOrEmail);
    if (!findUser) {
      return ResultFactory.unauthorized({
        field: 'loginOrEmail',
        message: 'User not found',
      });
    }
    const isMatchesUserPassword = await bcryptService.compareHash(
      loginData.password,
      findUser.passwordHash,
    );
    if (!isMatchesUserPassword) {
      return ResultFactory.unauthorized({
        field: 'loginOrEmail',
        message: 'Password or login is wrong',
      });
    }

    const deviceId = randomUUID();
    const userId = findUser._id.toString();
    const accessToken = await jwtService.createToken(userId);
    const refreshToken = await jwtService.createRefreshToken(userId, deviceId);
    const decodeRefresh: any = await jwtService.verifyRefreshToken(refreshToken);

    const deviceSessionData: DeviceSessionDBType = {
      userId,
      deviceId,
      ip: getClientIp(req),
      agent: req.headers['user-agent'] || 'Unknown',
      lastActiveDate: new Date().toISOString(),
      expiresDate: new Date(decodeRefresh.exp).toISOString(),
    };
    await deviceSessionsRepository.createSession(deviceSessionData);

    if (accessToken && refreshToken) {
      return ResultFactory.success({
        data: { accessToken, refreshToken },
        status: HttpStatuses.Ok,
        extensions: [],
      });
    } else {
      return ResultFactory.unauthorized({
        field: 'loginOrEmail',
        message: 'Password or login is wrong',
      });
    }
  },

  async logout(deviceId: string) {
    await deviceSessionsCollections.deleteOne({
      deviceId: deviceId,
    });

    return ResultFactory.noContent();
  },

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      return ResultFactory.unauthorized({
        field: 'token',
        message: 'token expired',
      });
    }

    const payload: any = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return ResultFactory.unauthorized({
        field: 'token',
        message: 'token expired',
      });
    }

    const session = await deviceSessionsCollections.findOne({ deviceId: payload.deviceId });
    if (!session) {
      return ResultFactory.unauthorized({
        field: 'token',
        message: 'token expired',
      });
    }

    const userId = payload.userId;

    const newAccessToken = await jwtService.createToken(userId);
    const newRefreshToken = await jwtService.createRefreshToken(userId, payload.deviceId);

    await deviceSessionsCollections.updateOne(
      { deviceId: payload.deviceId },
      {
        $set: {
          lastActiveDate: new Date().toISOString(),
        },
      },
    );

    if (newAccessToken && newRefreshToken) {
      return ResultFactory.success({
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        status: HttpStatuses.Ok,
        extensions: [],
      });
    } else {
      return ResultFactory.unauthorized({
        field: 'token',
        message: 'token expired',
      });
    }
  },

  async registrationUser(data: RegistrationCreateDto) {
    const conflict = await userRepository.existsByLoginOrEmail(data.login, data.email);

    if (conflict) {
      const field = data.login === conflict.login ? 'login' : 'email';
      return ResultFactory.badRequest({
        field,
        message: `user with the given ${field} already exists`,
      });
    }

    const passwordSalt = await bcryptService.createSalt();
    const passwordHash = await bcryptService.generateHash(data.password, passwordSalt);

    const newUser: UserDBType = {
      login: data.login,
      passwordHash,
      email: data.email,
      createdAt: new Date().toISOString(),
      currentRefreshToken: null,
      recoveryPassword: {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isRecovery: false,
      },
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

    return ResultFactory.noContent();
  },

  async passwordRecovery(email: string) {
    const findUserByEmail = await userQueryRepository.getUserByLoginOrEmail(email);
    if (!findUserByEmail) {
      return ResultFactory.badRequest({
        field: 'email',
        message: 'User not found',
      });
    }

    const recoveryCode = randomUUID();
    const expirationDate = add(new Date(), { hours: 1, minutes: 30 });
    await userService.updateUser(findUserByEmail._id.toString(), {
      'recoveryPassword.recoveryCode': recoveryCode,
      'recoveryPassword.expirationDate': expirationDate,
      'recoveryPassword.isRecovery': false,
    });

    try {
      await emailServices.sendRecoveryPassword({
        toEmail: email,
        code: recoveryCode,
      });
    } catch (err) {
      console.error('Send email error', err);
    }

    return ResultFactory.noContent();
  },

  async createNewPassword(data: { newPassword: string; recoveryCode: string }) {
    const { recoveryCode, newPassword } = data;

    async function isValidUUID(code: string): Promise<boolean> {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidPattern.test(code);
    }
    const isNotValid = await isValidUUID(recoveryCode);
    if (!isNotValid) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code not Valid',
      });
    }
    function isExpiredCode(expirationDate: Date | undefined): boolean {
      if (!expirationDate) return false;
      return Date.now() > expirationDate.getTime();
    }
    const findUser = await userQueryRepository.getUserByRecoveryCode(recoveryCode);
    if (!findUser) {
      return ResultFactory.badRequest({
        field: 'email',
        message: 'User not found',
      });
    }

    const passwordSalt = await bcryptService.createSalt();
    const passwordHash = await bcryptService.generateHash(newPassword, passwordSalt);

    const isExpired = isExpiredCode(findUser.emailConfirmation?.expirationDate);

    const hasBeenApplied = findUser.recoveryPassword?.isRecovery === true;
    if (isExpired) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code expired',
      });
    }

    if (hasBeenApplied) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code Already Applied',
      });
    }

    await userService.updateUser(findUser._id.toString(), {
      'recoveryPassword.isRecovery': true,
      passwordHash: passwordHash,
    });

    return ResultFactory.noContent();
  },

  async resendingEmailVerificationCode(email: string) {
    const findUser = await userQueryRepository.getUserByLoginOrEmail(email);
    if (!findUser) {
      return ResultFactory.badRequest({
        field: 'email',
        message: 'User not found',
      });
    }

    if (findUser.emailConfirmation?.isConfirmed) {
      return ResultFactory.badRequest({
        field: 'email',
        message: 'email already confirmed',
      });
    }

    const newCode = randomUUID();
    const expirationDate = add(new Date(), { hours: 1, minutes: 30 });
    await userService.updateUser(findUser._id.toString(), {
      'emailConfirmation.confirmationCode': newCode,
      'emailConfirmation.expirationDate': expirationDate,
    });

    try {
      await emailServices.sendConfirmationCode({
        toEmail: email,
        code: newCode,
      });
    } catch (err) {
      console.error('Send email error', err);
    }

    return ResultFactory.noContent();
  },

  async confirmationUser(code: string) {
    async function isValidUUID(code: string): Promise<boolean> {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidPattern.test(code);
    }
    const isNotValid = await isValidUUID(code);
    if (!isNotValid) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code not Valid',
      });
    }
    function isExpiredCode(expirationDate: Date | undefined): boolean {
      if (!expirationDate) return false;
      return Date.now() > expirationDate.getTime();
    }
    const findUser = await userQueryRepository.getUserByConfirmationCode(code);
    if (!findUser) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'User not found',
      });
    }
    const isExpired = isExpiredCode(findUser.emailConfirmation?.expirationDate);

    const hasBeenApplied = findUser.emailConfirmation?.isConfirmed === true;
    if (isExpired) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code expired',
      });
    }

    if (hasBeenApplied) {
      return ResultFactory.badRequest({
        field: 'code',
        message: 'Code Already Applied',
      });
    }

    await userService.updateUser(findUser._id.toString(), {
      'emailConfirmation.isConfirmed': true,
    });

    return ResultFactory.noContent();
  },
};
