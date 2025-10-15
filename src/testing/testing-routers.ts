import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../shared/enums/http-statuses';
import {
  blogsCollections,
  commentsCollections,
  deviceSessionsCollections,
  postsCollections,
  usersCollections,
} from '../setup/setup-mongo-db';

export const testingRouters = Router({});

testingRouters.delete('', async (_req: Request, res: Response) => {
  await Promise.allSettled([
    postsCollections.deleteMany({}),
    blogsCollections.deleteMany({}),
    usersCollections.deleteMany({}),
    commentsCollections.deleteMany({}),
    deviceSessionsCollections.deleteMany({}),
  ])
    .then(() => {
      res.sendStatus(HttpStatuses.NoContent);
    })
    .catch(() => {});
});
