import express from 'express';
import authRouter from './auth/router';
import { setupAuth } from './auth/setup';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setupAuth(app);

app.use('/auth', authRouter);

app.listen(port, host, () => {
  console.log(`[ready] http://${host}:${port}`);
});
