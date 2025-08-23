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

// Load swagger document safely
let swaggerDocument = null;
try {
  const swaggerPath = path.resolve('docs', 'swagger.json');
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  } else {
    console.warn(
      '⚠️ Swagger documentation file not found, API docs will be disabled',
    );
  }
} catch (error) {
  console.warn('⚠️ Error loading swagger documentation:', error.message);
}

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
        : [
            'http://localhost:5173',
            'https://recipes.exocriador.dev', // Add your production domain
            'https://recipes-fullstack-8rxx.onrender.com', // Add backend domain for testing
          ],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
            }
          : undefined,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  );

  // Setup swagger UI only if documentation is available
  if (swaggerDocument) {
    app.use(
      '/api-docs',
      swaggerUIExpress.serve,
      swaggerUIExpress.setup(swaggerDocument),
    );
  }

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
      docs: swaggerDocument ? '/api-docs' : 'Not available',
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
