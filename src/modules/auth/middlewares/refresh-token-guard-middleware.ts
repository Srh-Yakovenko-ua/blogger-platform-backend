import { NextFunction, Request, Response } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createError } from '../../../shared/utils/create-error';
import { jwtService } from '../../../shared/utils/jwt-service';
import { deviceSessionsCollections } from '../../../setup/setup-mongo-db';

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  const unauthorized = () => {
    res
      .status(HttpStatuses.Unauthorized)
      .send(createError([{ message: 'You are not authorized', field: 'Unauthorized' }]));
  };

  if (!refreshToken) {
    unauthorized();
    return;
  }

  const payload: any = await jwtService.verifyRefreshToken(refreshToken);
  console.log(payload, 'payload');
  if (!payload) {
    unauthorized();
    return;
  }

  const session = await deviceSessionsCollections.findOne({
    deviceId: payload.deviceId,
  });

  if (!session) {
    unauthorized();
    return;
  }
  const tokenIssuedAt = payload.iat;
  const lastActiveInSeconds = Math.floor(new Date(session.lastActiveDate).getTime() / 1000);
  if (tokenIssuedAt < lastActiveInSeconds) {
    unauthorized();
    return;
  }
  req.user = { id: payload.userId };
  req.deviceId = payload.deviceId;
  next();
};
