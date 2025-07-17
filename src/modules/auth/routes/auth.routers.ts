import { Router, Response, Request } from 'express';
import { loginValidation } from '../dto/login-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { authService } from '../service/auth.service';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';

export const authRouters = Router({});

authRouters.post(
  '/login',
  loginValidation,
  throwValidationErrorsDTO,
  async (req: Request<{}, {}, { loginOrEmail: string; password: string }, {}>, res: Response) => {
    try {
      const isLogin = await authService.loginUser(req.body);

      if (isLogin) {
        res.sendStatus(HttpStatuses.NoContent);
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
