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
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173'],
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
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerDocument),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Recipes API is running',
      endpoints: {
        auth: '/api/auth',
        recipes: '/api/recipes',
        categories: '/api/categories',
        ingredients: '/api/ingredients',
        users: '/api/users',
      },
      docs: '/api-docs',
      healthcheck: '/health',
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);
  app.listen(PORT, () => {
    startLogs();
  });
};
