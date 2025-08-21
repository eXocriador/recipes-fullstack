import Recipe from "../../db/models/recipe.js";

import { calculatePaginationData } from "../../utils/calculatePaginationData.js";
export const getAllRecipes = async ({
    page = 1,
    perPage = 12,
    filter = {},

}) => {
const limit = perPage;
    const skip = (page - 1) * perPage;

    const recipesQuery = Recipe.find();
    
    if (filter.category) {
        recipesQuery.where('category').equals(filter.category);
    }
  if (filter.ingredient) {
    recipesQuery.where('ingredients.id').equals(filter.ingredient);
  }
    if (filter.title) {
      recipesQuery.where('title', filter.title); 
    }

    // const recipesCount = await Recipe.find().merge(recipesQuery).countDocuments();
    // const recipes = await recipesQuery.skip(skip).limit(limit).exec();

    const [recipesCount, recipes] = await Promise.all([
        Recipe.find().merge(recipesQuery).countDocuments(),
        recipesQuery.skip(skip).limit(limit).exec(),
    ]);

    const paginationData = calculatePaginationData(recipesCount, perPage, page);

  return {
      data: recipes,
    ...paginationData,
  };
};
export const getPublicRecipeById = async (recipeId) => {
  const recipe = await Recipe.findById(recipeId);
  return recipe;
};
