import express from 'express';
import { setupApp } from './setup-app';

const PORT = process.env.PORT || 5000;
const app = express();

setupApp(app);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
