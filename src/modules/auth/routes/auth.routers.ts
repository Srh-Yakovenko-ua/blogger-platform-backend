import { Router, Response, Request } from 'express';
import { loginValidation } from '../dto/login-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { authService } from '../service/auth.service';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { authGuardMiddleware } from '../middlewares/auth-guard-middleware';
import { userQueryService } from '../../users/service/user-query.service';
import { registrationDto } from '../dto/registration-dto';

import { RegistrationCreateDto } from '../types/registration-create-dto';
import { registrationEmailResendingDto } from '../types/registration-email-resending-dto';

export const authRouters = Router({});

authRouters.post(
  '/login',
  loginValidation,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { loginOrEmail: string; password: string }, {}>, res: Response) => {
    try {
      const accessToken = await authService.loginUser(req.body);

      if (accessToken) {
        res.status(HttpStatuses.Ok).send({ accessToken });
      } else {
        res
          .status(HttpStatuses.Unauthorized)
          .send(createError([{ field: 'loginOrEmail', message: 'Password or login is wrong' }]));
      }
    } catch (err) {
      res.status(HttpStatuses.BadRequest).send(
        createError([
          {
            message: `${err}`,
            field: 'loginOrEmail',
          },
        ]),
      );
    }
  },
);

authRouters.post(
  '/registration',
  registrationDto,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, RegistrationCreateDto, {}>, res: Response) => {
    try {
      await authService.registrationUser(req.body);
      res.sendStatus(HttpStatuses.NoContent);
    } catch (err) {
      res.status(HttpStatuses.BadRequest).send(
        createError([
          {
            field: 'email',
            message: 'user with the given email or login already exists',
          },
        ]),
      );
    }
  },
);
authRouters.post(
  '/registration-email-resending',
  registrationEmailResendingDto,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { email: string }, {}>, res: Response) => {
    try {
      await authService.resendingEmailVerificationCode(req.body.email);
      res.sendStatus(HttpStatuses.NoContent);
    } catch (err) {
      res.status(HttpStatuses.BadRequest).send(
        createError([
          {
            field: 'code',
            message: `${err}`,
          },
        ]),
      );
    }
  },
);
authRouters.post(
  '/registration-confirmation',
  async (req: Request<{}, {}, { code: string }, {}>, res: Response) => {
    try {
      await authService.confirmationUser(req.body.code);
      res.sendStatus(HttpStatuses.NoContent);
    } catch (err) {
      res.status(HttpStatuses.Unauthorized).send(
        createError([
          {
            field: 'code',
            message: `${err}`,
          },
        ]),
      );
    }
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
    res.status(HttpStatuses.Ok).send(findMe);
  },
);
