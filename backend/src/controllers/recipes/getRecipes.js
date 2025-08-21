import { getOwnRecipes } from '../../services/recipes/getOwnRecipes.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';

export async function getOwnRecipesController(req, res, next) {
  try {
    const userId = req.user._id;

    const { page, perPage } = parsePaginationParams(req.query);

    const favorites = await getOwnRecipes(userId, page, perPage);
    res.status(200).json({
      status: 200,
      message: 'Own recipes retrieved successfully',
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
}
