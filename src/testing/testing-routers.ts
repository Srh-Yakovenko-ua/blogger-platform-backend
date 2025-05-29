import { Router, Response, Request } from 'express';
import { HttpStatuses } from '../shared/enums/http-statuses';
import { localBlogsDb } from '../modules/blogs/local-db/local-blogs-db';
import { postsLocalDb } from '../modules/posts/local-db/posts-local-db';

export const testingRouters = Router({});

testingRouters.delete('', (_req: Request, res: Response) => {
  localBlogsDb.length = 0;
  postsLocalDb.length = 0;
  res.sendStatus(HttpStatuses.NoContent);
});
