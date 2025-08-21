import mongoose from 'mongoose';
import User from '../../db/models/auth/user.js';
import Recipe from '../../db/models/recipe.js';
import createHttpError from 'http-errors';
import { calculatePaginationData } from '../../utils/calculatePaginationData.js';

export const getFavoriteRecipes = async (userId, page = 1, perPage = 12) => {
  const user = await User.findById(userId);
  const limit = perPage;
  const skip = (page - 1) * perPage;
  if (!user || !user.favorites.length) {
    // If no user or empty favorites, return empty paginated response
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      perPage,
      totalItems: 0,
    };
  }

  const favoriteIds = user.favorites
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (favoriteIds.length === 0) {
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      perPage,
      totalItems: 0,
    };
  }

  const recipesQuery = Recipe.find({
    _id: { $in: favoriteIds },
  });

  const [recipesCount, recipes] = await Promise.all([
    Recipe.countDocuments({ _id: { $in: favoriteIds } }),
    recipesQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(recipesCount, perPage, page);

  return {
    data: recipes,
    ...paginationData,
  };
};

export const addFavoriteRecipe = async (userId, recipeId) => {
  const user = await User.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw createHttpError(400, 'Invalid recipe ID');
  }

  const alreadyFavorite = user.favorites.some(
    (id) => id.toString() === recipeId.toString(),
  );
  if (alreadyFavorite) {
    return user;
  }

  user.favorites.push(new mongoose.Types.ObjectId(recipeId));

  return await user.save();
};

export const deleteFavoriteRecipe = async (userId, recipeId) => {
  const user = await User.findById(userId);
  const updatedFavorites = user.favorites.filter(
    (favId) => favId.toString() !== recipeId,
  );

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { favorites: updatedFavorites },
    { new: true },
  );

  return updatedUser;
};
