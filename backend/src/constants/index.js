// backend/src/constants/index.js
import path from 'path';

// Для тестування
export const TEN_SECONDS = 10 * 1000;
export const THIRTY_MINUTES_FOR_TEST = 30 * 60 * 1000;

// Для продакшену
export const THIRTY_MINUTES = 30 * 60 * 1000;
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// --- Видали старі константи, якщо вони конфліктують ---
export const ONE_HOUR = 60 * 60 * 1000;
export const THIRTY_SECONDS = 30 * 1000;

// Swagger documentation path
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
