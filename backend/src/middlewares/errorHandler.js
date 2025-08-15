// src/middlewares/errorHandler.js

// Import HttpError class for handling HTTP errors with appropriate status codes
import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  // Check if we received an error from createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
