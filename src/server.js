import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from '#root/routes/contactsRouter.js';
import { notFoundHandler } from '#root/middlewares/notFoundHandler.js';
import { errorHandler } from '#root/middlewares/errorHandler.js';
import authRouter from '#root/routes/auth.js';
import debugRouter from '#root/routes/debug.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());
  app.use(cookieParser());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const swaggerFilePath = resolve(__dirname, '../docs/swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/debug', debugRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
