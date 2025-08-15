import Joi from 'joi';

const ingredientSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),         // Очікуємо Mongo ObjectId
  measure: Joi.string().max(64).required(),
});

export const recipeSchema = Joi.object({
  title: Joi.string().max(64).required(),
  description: Joi.string().max(200).required(),
  time: Joi.string().max(64).required(),                 
  calories: Joi.number().integer().min(1).max(10000).optional().allow(null),
  category: Joi.string().required(),
  area: Joi.string().max(64).optional().allow('', null),
  ingredients: Joi.array().items(ingredientSchema).min(2).max(16).required(),
  instructions: Joi.string().max(1200).required(),
  thumb: Joi.string().uri().optional().allow(null, ''),
  thumbPublicId: Joi.string().optional().allow(null, ''),
});