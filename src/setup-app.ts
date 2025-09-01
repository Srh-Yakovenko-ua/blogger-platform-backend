import express, { ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

import { blogRouters } from './modules/blogs/routers/blog.routers';
import { testingRouters } from './testing/testing-routers';
import { postRouters } from './modules/posts/routers/post.routers';
import { authRouters } from './modules/auth/routes/auth.routers';
import { userRouters } from './modules/users/routers/user.routers';
import { commentsRouters } from './modules/comments/routes/comments-routers';
import { deviceSessionsRoutes } from './modules/device-sessions/routes/device-sessions-routes';

const INIT_ROUTE = '/ht_02/api';
export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());
  app.set('trust proxy', true);

  app.use(`${INIT_ROUTE}/auth`, authRouters);
  app.use(`${INIT_ROUTE}/security`, deviceSessionsRoutes);
  app.use(`${INIT_ROUTE}/users`, userRouters);
  app.use(`${INIT_ROUTE}/blogs`, blogRouters);
  app.use(`${INIT_ROUTE}/posts`, postRouters);
  app.use(`${INIT_ROUTE}/comments`, commentsRouters);
  app.use(`${INIT_ROUTE}/testing/all-data`, testingRouters);

  return app;
};
