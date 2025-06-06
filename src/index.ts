import express from 'express';
import { setupApp } from './setup-app';
import { runDB } from './setup/setup-mongo-db';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const localUri = process.env.MOGNO_LOCAL;
const atlasUri = process.env.MONGO_ATLAS;
const app = express();

async function bootstrap() {
  await runDB(localUri!);
  setupApp(app);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

bootstrap();
