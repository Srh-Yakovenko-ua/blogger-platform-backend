import { Router, Response, Request } from 'express';
import { loginValidation } from '../dto/login-dto';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';

export const authRouters = Router({});

authRouters.post(
  '/login',
  loginValidation,
  throwValidationErrorsDTO,
  (req: Request<{}, {}, { loginOrEmail: string; password: string }, {}>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    res.send(200);
  },
);
