import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRouter from './interfaces/routes/AuthRouter';
import { setupAuth } from './infrastructure/auth/PassportSetup';
import { connectToDatabase } from './infrastructure/db';
import { errorHandler } from './interfaces/middlewares/ErrorHandler';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Set up database and then start the server
connectToDatabase()
  .then(async () => {
    // Await the setupAuth to ensure session and passport are properly initialized
    await setupAuth(app);

    // After setting up passport, initialize your routes
    app.use('/auth', authRouter);
    app.use(errorHandler);

    // Start listening for requests
    app.listen(port, host, () => {
      console.log(`[ready] http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });
