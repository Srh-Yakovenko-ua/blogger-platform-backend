import { Router, Request, Response } from 'express';
import { authGuardMiddleware } from '../../auth/middlewares/auth-guard-middleware';
import { throwValidationErrorsDTO } from '../../../shared/dto/throw-validation-errors-dto';
import { deviceSessionsCollections } from '../../../setup/setup-mongo-db';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { jwtService } from '../../../shared/utils/jwt-service';

export const deviceSessionsRoutes = Router({});

deviceSessionsRoutes.get(
  '/devices',
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const findAll = await deviceSessionsCollections.find({ userId }).toArray();
    const viewModel = findAll.map((session) => ({
      ip: session.ip,
      title: session.agent,
      lastActiveDate: session.lastActiveDate,
      deviceId: session.deviceId,
    }));
    res.status(HttpStatuses.Ok).send(viewModel);
  },
);
deviceSessionsRoutes.delete(
  '/devices/:deviceId',
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request<{ deviceId: string }>, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    const payload: any = await jwtService.verifyRefreshToken(refreshToken);

    const userId = req.user?.id;
    const currentDeviceId = payload.deviceId;
    const targetDeviceId = req.params.deviceId;
    console.log(targetDeviceId);
    if (!targetDeviceId) res.sendStatus(HttpStatuses.BadRequest);
    if (targetDeviceId === currentDeviceId) res.sendStatus(HttpStatuses.Forbidden);

    const session = await deviceSessionsCollections.findOne({ deviceId: targetDeviceId });

    if (!session) {
      res.sendStatus(404);
      return;
    }
    if (session.userId !== userId) res.sendStatus(403);

    await deviceSessionsCollections.deleteOne({ deviceId: targetDeviceId });

    res.sendStatus(204);
  },
);
deviceSessionsRoutes.delete(
  '/devices',
  authGuardMiddleware,
  throwValidationErrorsDTO,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    await deviceSessionsCollections.deleteMany({
      userId,
    });
    res.sendStatus(HttpStatuses.NoContent);
  },
);
