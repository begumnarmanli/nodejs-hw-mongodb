import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contactsRouter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
