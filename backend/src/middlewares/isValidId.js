// src/middlewares/isValidId.js

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { recipeId } = req.params;
  if (!isValidObjectId(recipeId)) {
    throw createHttpError(404, 'Contact not found');
  }

  next();
};
