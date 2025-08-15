import createHttpError from 'http-errors';
import {
  addFavoriteRecipe,
  deleteFavoriteRecipe,
  getFavoriteRecipes,
} from '../../services/recipes/favorites.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';

export async function getFavoriteRecipeController(req, res, next) {
  try {
    const userId = req.user._id;

    const { page, perPage } = parsePaginationParams(req.query);

    const favorites = await getFavoriteRecipes(userId, page, perPage);
    res.status(200).json({
      status: 200,
      message: 'Favorite recipes retrieved successfully',
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
}

export async function addFavoriteRecipeController(req, res, next) {
  try {
    const userId = req.user._id;
    const { recipeId } = req.body;
    const favorites = await addFavoriteRecipe(userId, recipeId);
    if (!favorites) {
      throw createHttpError(404, 'No favorite recepies');
    }
    res
      .status(201)
      .json({ message: 'Recipe added to favorites', data: favorites });
  } catch (error) {
    next(error);
  }
}

export async function deleteFavoriteRecipeController(req, res, next) {
  const userId = req.user._id;

  const { recipeId } = req.params;
  const favorites = await deleteFavoriteRecipe(userId, recipeId);
  if (!favorites) {
    throw createHttpError(404, 'No favorite recepies');
  }
  res.status(204).json({
    status: 204,
    message: 'Recipe removed from favorites',
    data: favorites,
  });
}
