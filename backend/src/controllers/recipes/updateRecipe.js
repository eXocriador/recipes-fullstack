import Recipe from '../../db/models/recipe.js';

export const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Recipe.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ status: 404, message: 'Recipe not found' });
    }
    res.json({
      status: 200,
      message: 'Recipe updated',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
