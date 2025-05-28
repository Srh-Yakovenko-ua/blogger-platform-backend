import express, { Express } from 'express';
import { blogRouters } from './modules/blogs/routers/blog.routers';

const INIT_ROUTE = '/ht_02/api';
export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(`${INIT_ROUTE}/blogs`, blogRouters);

  return app;
};
