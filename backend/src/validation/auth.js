import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().max(16).required(),
  email: Joi.string().email().max(128).required(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export { registerSchema, loginSchema };
