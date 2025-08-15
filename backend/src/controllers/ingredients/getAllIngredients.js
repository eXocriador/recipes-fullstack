import { getAllIngredients } from '../../services/ingredients/getAllIngredients.js';

export const getAllIngredientsController = async (req, res, next) => {
  try {
    const ingredients = await getAllIngredients();
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};
