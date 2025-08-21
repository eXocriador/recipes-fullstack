import mongoose from 'mongoose';

import Recipe from '../../db/models/recipe.js';
import { calculatePaginationData } from '../../utils/calculatePaginationData.js';

export const getOwnRecipes = async (userId, page = 1, perPage = 12) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const recipesQuery = Recipe.find({
    owner: { $in: userObjectId },
  });

  const [recipesCount, recipes] = await Promise.all([
    Recipe.countDocuments({ owner: { $in: userObjectId } }),
    recipesQuery.skip(skip).limit(limit).exec(),
  ]);

  if (recipesCount === 0) {
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      perPage,
      totalItems: 0,
    };
  }

  const paginationData = calculatePaginationData(recipesCount, perPage, page);

  return {
    data: recipes,
    ...paginationData,
  };
};
