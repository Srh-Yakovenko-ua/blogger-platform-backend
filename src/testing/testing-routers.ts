import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../shared/enums/http-statuses';
import { postsLocalDb } from '../modules/posts/local-db/posts-local-db';

export const testingRouters = Router({});

testingRouters.delete('', (_req: Request, res: Response) => {
  postsLocalDb.length = 0;
  res.sendStatus(HttpStatuses.NoContent);
});
