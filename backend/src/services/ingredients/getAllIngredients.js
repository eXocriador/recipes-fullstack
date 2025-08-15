import { Ingredient } from '../../db/models/ingredients/ingredient.js';

export const getAllIngredients = async () => {
  const ingredients = await Ingredient.find({}, 'name img desc _id');
  return ingredients;
};
