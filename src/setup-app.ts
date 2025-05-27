import express, { Express } from 'express';


export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  return app;
};
