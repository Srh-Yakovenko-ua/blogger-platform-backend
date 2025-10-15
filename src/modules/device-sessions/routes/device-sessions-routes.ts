import { Router, Request, Response, NextFunction } from 'express';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { deviceSessionsCollections } from '../../../setup/setup-mongo-db';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { jwtService } from '../../../shared/utils/jwt-service';
import { createError } from '../../../shared/utils/create-error';
import { refreshTokenGuardMiddleware } from '../../auth/middlewares/refresh-token-guard-middleware';

export const deviceSessionsRoutes = Router({});

deviceSessionsRoutes.get(
  '/devices',
  refreshTokenGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const findAll = await deviceSessionsCollections.find({ userId }).toArray();
    const viewModel = findAll.map((session) => ({
      ip: session.ip,
      title: session.agent || 'Unknown Device',
      lastActiveDate: session.lastActiveDate,
      deviceId: session.deviceId,
    }));
    res.status(HttpStatuses.Ok).send(viewModel);
  },
);
deviceSessionsRoutes.delete(
  '/devices/:deviceId',
  refreshTokenGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request<{ deviceId: string }>, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
      }

      const payload: any = await jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
      }

      const userId = req.user?.id;
      const currentDeviceId = payload.deviceId;
      const targetDeviceId = req.params.deviceId;

      if (!targetDeviceId) {
        res.sendStatus(HttpStatuses.BadRequest);
        return;
      }

      if (targetDeviceId === currentDeviceId) {
        res.sendStatus(HttpStatuses.Forbidden);
        return;
      }

      const session = await deviceSessionsCollections.findOne({
        deviceId: targetDeviceId,
      });

      if (!session) {
        res.sendStatus(HttpStatuses.NotFound);
        return;
      }

      if (session.userId !== userId) {
        res.sendStatus(HttpStatuses.Forbidden);
        return;
      }

      const response = await deviceSessionsCollections.deleteOne({ deviceId: targetDeviceId });
      console.log(response);
      res.sendStatus(HttpStatuses.NoContent);
    } catch (error) {
      console.error('Error deleting device session:', error);
      res.sendStatus(HttpStatuses.InternalServerError);
    }
  },
);

deviceSessionsRoutes.delete(
  '/devices',
  refreshTokenGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
      }

      const payload: any = await jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        res.sendStatus(HttpStatuses.Unauthorized);
        return;
      }

      const userId = req.user?.id;
      const currentDeviceId = payload.deviceId;

      await deviceSessionsCollections.deleteMany({
        userId,
        deviceId: { $ne: currentDeviceId },
      });

      res.sendStatus(HttpStatuses.NoContent);
    } catch (error) {
      console.error('Error deleting devices:', error);
      res.sendStatus(HttpStatuses.InternalServerError);
    }
  },
);
