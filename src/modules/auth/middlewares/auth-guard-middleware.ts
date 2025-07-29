import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { jwtService } from '../../../shared/utils/jwt-service';

type PayloadAccessTokenType = {
  userId: string;
  iat: number;
  exp: number;
};
function isValidJwtFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts.every((p) => /^[A-Za-z0-9-_]+$/.test(p));
}
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
  if (!isValidJwtFormat(token)) return unauthorized();

  const payload: any = await jwtService.verifyToken(token);
  console.log(payload);
  if (!payload) return unauthorized();

  req.user = { id: payload.userId };

  next();
};
