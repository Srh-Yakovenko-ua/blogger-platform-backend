import { Request, Response, Router } from 'express';
import { loginValidation } from '../dto/login-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { authService } from '../service/auth.service';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { authGuardMiddleware } from '../middlewares/auth-guard-middleware';
import { userQueryService } from '../../users/service/user-query.service';
import { registrationDto } from '../dto/registration-dto';

import { RegistrationCreateDto } from '../types/registration-create-dto';
import { registrationEmailResendingValidation } from '../types/registration-email-resending-validation';
import { rateLimitMiddleware } from '../../../shared/middleware/rate-limit-middleware';
import { passwordRecoveryValidation } from '../dto/password-recovery-validation';
import { newPasswordValidation } from '../dto/new-password-validation';
import { refreshTokenGuardMiddleware } from '../middlewares/refresh-token-guard-middleware';

export const authRouters = Router({});

authRouters.post(
  '/login',
  rateLimitMiddleware,
  loginValidation,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { loginOrEmail: string; password: string }, {}>, res: Response) => {
    const result = await authService.loginUser(req.body, req);

    if (result.status === HttpStatuses.BadRequest) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    if (result.status === HttpStatuses.Unauthorized) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.cookie('refreshToken', result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(result.status).send({ accessToken: result.data?.accessToken });
  },
);

authRouters.post(
  '/logout',
  refreshTokenGuardMiddleware,
  async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const deviceId = req.deviceId;
    const result = await authService.logout(deviceId!);
    if (result.status === HttpStatuses.Unauthorized) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.sendStatus(result.status);
  },
);

authRouters.post(
  '/registration',
  registrationDto,
  rateLimitMiddleware,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, RegistrationCreateDto, {}>, res: Response) => {
    const result = await authService.registrationUser(req.body);
    if (result.status === HttpStatuses.BadRequest) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.sendStatus(result.status);
  },
);
authRouters.post(
  '/refresh-token',
  refreshTokenGuardMiddleware,
  async (req: Request<{}, {}, {}, {}>, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshToken(refreshToken);

    if (result.status === HttpStatuses.Unauthorized) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }

    res.cookie('refreshToken', result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(result.status).send({ accessToken: result.data?.accessToken });
  },
);

authRouters.post(
  '/password-recovery',
  rateLimitMiddleware,
  passwordRecoveryValidation,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { email: string }, {}>, res: Response) => {
    const result = await authService.passwordRecovery(req.body.email);

    res.sendStatus(result?.status);
  },
);
authRouters.post(
  '/new-password',
  rateLimitMiddleware,
  newPasswordValidation,
  throwValidationErrorsDTO,
  async (
    req: Request<{}, {}, { newPassword: string; recoveryCode: string }, {}>,
    res: Response,
  ) => {
    const result = await authService.createNewPassword(req.body);

    if (result.status === HttpStatuses.BadRequest) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.sendStatus(result.status);
  },
);
authRouters.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  registrationEmailResendingValidation,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { email: string }, {}>, res: Response) => {
    const result = await authService.resendingEmailVerificationCode(req.body.email);

    if (result.status === HttpStatuses.BadRequest) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.sendStatus(result.status);
  },
);
authRouters.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  async (req: Request<{}, {}, { code: string }, {}>, res: Response) => {
    const result = await authService.confirmationUser(req.body.code);
    if (result.status === HttpStatuses.BadRequest) {
      res.status(result.status).send(createError(result.extensions));
      return;
    }
    res.sendStatus(result.status);
  },
);

authRouters.get(
  '/me',
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request, res: Response) => {
    const userID = req.user?.id as string;

    const findMe = await userQueryService.getUserByID(userID);

    if (!findMe) res.sendStatus(HttpStatuses.Unauthorized);
    const meData = {
      email: findMe?.email,
      userId: findMe?.id,
      login: findMe?.login,
    };
    res.status(HttpStatuses.Ok).send(meData);
  },
);
