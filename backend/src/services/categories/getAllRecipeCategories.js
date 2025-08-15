import { RecipeCategory } from '../../db/models/categories/recipeCategory.js';

export const getAllRecipeCategories = async () => {
  const categories = await RecipeCategory.find({}, 'name');
  return categories;
};
