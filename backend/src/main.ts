import express from 'express';
import authRouter from './auth/router';
import { setupAuth } from './auth/setup';
import cors from 'cors';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

setupAuth(app);

app.use('/auth', authRouter);

app.listen(port, host, () => {
  console.log(`[ready] http://${host}:${port}`);
});
