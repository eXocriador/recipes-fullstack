import Recipe from '../../db/models/recipe.js';

export const createRecipe = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const recipe = await Recipe.create({
      ...req.body,
      owner,
    });
    res.status(201).json({
      status: 201,
      message: 'Recipe created',
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};
