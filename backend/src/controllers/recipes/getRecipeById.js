import Recipe from '../../db/models/recipe.js';

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('owner', 'name email');
    if (!recipe) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    res.json({
      status: 200,
      message: 'Recipe fetched',
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};
