import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { jwtService } from '../../../shared/utils/jwt-service';

type PayloadAccessTokenType = {
  userId: string;
  iat: number;
  exp: number;
};
export const authGuardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'] as string;

  const unauthorized = () => {
    res
      .status(HttpStatuses.Unauthorized)
      .send(createError([{ message: 'You are not authorized', field: 'Unauthorized' }]));
  };

  if (!auth) return unauthorized();

  const [authType, token] = auth.split(' ');
  if (authType !== 'Bearer') return unauthorized();

  console.log({ authType, token });
  const payload: PayloadAccessTokenType = await jwtService.verifyToken(token);
  if (!payload) return unauthorized();

  req.user = { id: payload.userId };
  console.log(payload);

  next();
};
