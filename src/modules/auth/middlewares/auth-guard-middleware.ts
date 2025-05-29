import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';

const LOGIN = 'admin';
const PASSWORD = 'qwerty';
export const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'] as string;
  if (!auth) {
    res
      .status(HttpStatuses.Unauthorized)
      .send(createError([{ message: 'You are not authorized', field: 'Unauthorized' }]));
  }
  const [authType, token] = auth.split(' ');
  if (authType !== 'Basic') {
    res
      .status(HttpStatuses.Unauthorized)
      .send(createError([{ message: 'You are not authorized', field: 'Unauthorized' }]));
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== LOGIN || password !== PASSWORD) {
    res
      .status(HttpStatuses.Unauthorized)
      .send(createError([{ message: 'You are not authorized', field: 'Unauthorized' }]));
    return;
  }

  next();
};
