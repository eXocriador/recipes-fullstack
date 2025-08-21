import { getAllRecipeCategories } from '../../services/categories/getAllRecipeCategories.js';

export const getAllRecipeCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllRecipeCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
