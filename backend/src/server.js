// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { startLogs } from './utils/startLogs.js';
import swaggerUIExpress from 'swagger-ui-express';
import path from 'node:path';
import fs from 'node:fs';

const PORT = Number(getEnvVar('PORT', '3000'));
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);

export const startServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://fullstack-project-chi-black.vercel.app',
      ],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(
    '/api-docs',
    (req, res, next) => {
      console.log('Request for Swagger UI received');
      next();
    },
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerDocument),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);
  app.listen(PORT, () => {
    startLogs();
  });
};
