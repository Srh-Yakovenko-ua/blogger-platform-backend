import { Router, Response, Request } from 'express';
import { loginValidation } from '../dto/login-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { authService } from '../service/auth.service';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { authGuardMiddleware } from '../middlewares/auth-guard-middleware';
import { userQueryService } from '../../users/service/user-query.service';

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
      res.status(HttpStatuses.Unauthorized).send(
        createError([
          {
            field: 'loginOrEmail',
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
