import Recipe from '../../db/models/recipe.js';

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Recipe.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
