import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    console.log('validateBody middleware - validating req.body:', req.body);
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    console.log('validateBody middleware - validation passed');
    next();
  } catch (err) {
    console.log('validateBody middleware - validation failed:', err.details);
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};
